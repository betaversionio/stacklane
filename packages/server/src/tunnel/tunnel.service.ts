import { Injectable, Inject } from "@nestjs/common";
import net from "net";
import { SshService } from "../ssh/ssh.service.js";
import { StoreService } from "../store/store.service.js";

interface TunnelInfo {
  id: string;
  connectionId: string;
  remoteHost: string;
  remotePort: number;
  localPort: number;
  server: net.Server;
}

@Injectable()
export class TunnelService {
  private tunnels = new Map<string, TunnelInfo>();

  constructor(
    @Inject(SshService) private readonly ssh: SshService,
    @Inject(StoreService) private readonly store: StoreService
  ) {}

  async create(
    connectionId: string,
    remoteHost: string,
    remotePort: number
  ): Promise<{ id: string; localPort: number }> {
    // Reuse existing tunnel for same target
    for (const t of this.tunnels.values()) {
      if (
        t.connectionId === connectionId &&
        t.remoteHost === remoteHost &&
        t.remotePort === remotePort
      ) {
        return { id: t.id, localPort: t.localPort };
      }
    }

    const config = this.store.servers.findById(connectionId);
    if (!config) {
      throw new Error('Connection not found');
    }

    // Ensure the SSH connection is established
    await this.ssh.createSSHConnection(config);

    const server = net.createServer(async (socket) => {
      try {
        // Get a fresh client reference each time — handles reconnects
        const client = await this.ssh.createSSHConnection(config);
        client.forwardOut(
          "127.0.0.1",
          0,
          remoteHost,
          remotePort,
          (err, channel) => {
            if (err) {
              socket.destroy();
              return;
            }
            socket.pipe(channel).pipe(socket);
            socket.on("error", () => channel.close());
            channel.on("error", () => socket.destroy());
          }
        );
      } catch {
        socket.destroy();
      }
    });

    const localPort = await new Promise<number>((resolve, reject) => {
      server.listen(0, "127.0.0.1", () => {
        const addr = server.address();
        if (addr && typeof addr !== "string") {
          resolve(addr.port);
        } else {
          reject(new Error("Failed to bind port"));
        }
      });
      server.on("error", reject);
    });

    const id = `${connectionId}:${remoteHost}:${remotePort}`;
    this.tunnels.set(id, {
      id,
      connectionId,
      remoteHost,
      remotePort,
      localPort,
      server,
    });

    return { id, localPort };
  }

  list(connectionId: string) {
    const result: { id: string; remoteHost: string; remotePort: number; localPort: number }[] = [];
    for (const t of this.tunnels.values()) {
      if (t.connectionId === connectionId) {
        result.push({
          id: t.id,
          remoteHost: t.remoteHost,
          remotePort: t.remotePort,
          localPort: t.localPort,
        });
      }
    }
    return result;
  }

  destroy(id: string) {
    const tunnel = this.tunnels.get(id);
    if (tunnel) {
      tunnel.server.close();
      this.tunnels.delete(id);
    }
  }

  destroyAll(connectionId: string) {
    for (const [id, t] of this.tunnels) {
      if (t.connectionId === connectionId) {
        t.server.close();
        this.tunnels.delete(id);
      }
    }
  }
}
