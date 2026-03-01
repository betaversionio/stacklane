import { Inject } from "@nestjs/common";
import { WebSocketGateway, OnGatewayConnection } from "@nestjs/websockets";
import type { WebSocket } from "ws";
import type { WsMessage } from "@stacklane/shared";
import type { ClientChannel } from "ssh2";
import { StoreService } from "../store/store.service.js";
import { SshService } from "../ssh/ssh.service.js";

@WebSocketGateway({ path: "/ws/terminal" })
export class TerminalGateway implements OnGatewayConnection {
  constructor(
    @Inject(StoreService) private readonly store: StoreService,
    @Inject(SshService) private readonly ssh: SshService
  ) {}

  handleConnection(client: WebSocket) {
    let stream: ClientChannel | null = null;
    let currentConnectionId: string | null = null;

    client.on("message", async (raw: Buffer) => {
      try {
        const msg: WsMessage = JSON.parse(raw.toString());

        switch (msg.type) {
          case "terminal:input": {
            if (stream && msg.data) {
              stream.write(msg.data);
            } else if (!stream && msg.connectionId) {
              currentConnectionId = msg.connectionId;
              const config = this.store.getConnection(msg.connectionId);
              if (!config) {
                sendMessage(client, {
                  type: "terminal:error",
                  connectionId: msg.connectionId,
                  error: "Connection not found",
                });
                return;
              }

              try {
                const sshClient = await this.ssh.createSSHConnection(config);
                sshClient.shell(
                  {
                    term: "xterm-256color",
                    cols: msg.cols || 80,
                    rows: msg.rows || 24,
                  },
                  (err, sh) => {
                    if (err) {
                      sendMessage(client, {
                        type: "terminal:error",
                        connectionId: msg.connectionId,
                        error: err.message,
                      });
                      return;
                    }

                    stream = sh;

                    sendMessage(client, {
                      type: "terminal:connected",
                      connectionId: msg.connectionId,
                    });

                    sh.on("data", (data: Buffer) => {
                      sendMessage(client, {
                        type: "terminal:output",
                        connectionId: msg.connectionId,
                        data: data.toString("utf-8"),
                      });
                    });

                    sh.on("close", () => {
                      sendMessage(client, {
                        type: "terminal:close",
                        connectionId: msg.connectionId,
                      });
                      stream = null;
                    });

                    if (msg.data) {
                      sh.write(msg.data);
                    }
                  }
                );
              } catch (err: unknown) {
                const error = err instanceof Error ? err.message : "SSH connection failed";
                sendMessage(client, {
                  type: "terminal:error",
                  connectionId: msg.connectionId,
                  error,
                });
              }
            }
            break;
          }

          case "terminal:resize": {
            if (stream && msg.cols && msg.rows) {
              stream.setWindow(msg.rows, msg.cols, 0, 0);
            }
            break;
          }
        }
      } catch {
        // Invalid JSON, ignore
      }
    });

    client.on("close", () => {
      if (stream) {
        stream.close();
        stream = null;
      }
      if (currentConnectionId) {
        this.ssh.disconnectSSH(currentConnectionId);
      }
    });
  }
}

function sendMessage(ws: WebSocket, msg: WsMessage) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}
