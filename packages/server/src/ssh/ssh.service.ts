import { Injectable, Inject } from "@nestjs/common";
import fs from "fs";
import { Client } from "ssh2";
import type { ServerConnection } from "@stacklane/shared";
import { StoreService } from "../store/store.service.js";

@Injectable()
export class SshService {
  private activeConnections = new Map<string, Client>();

  constructor(@Inject(StoreService) private readonly store: StoreService) {}

  getSSHClient(connectionId: string): Client | undefined {
    return this.activeConnections.get(connectionId);
  }

  private resolveKeychainKey(config: ServerConnection): ServerConnection {
    if (
      config.authMethod === 'key' &&
      config.keychainKeyId &&
      !config.privateKey
    ) {
      const key = this.store.keychain.findById(config.keychainKeyId);
      if (key) {
        const resolved = { ...config };
        if (key.type === "text" && key.keyContent) {
          resolved.privateKey = key.keyContent;
        } else if (key.type === "path" && key.keyPath) {
          const expandedPath = key.keyPath.replace(
            /^~/,
            process.env.HOME || process.env.USERPROFILE || ""
          );
          resolved.privateKey = fs.readFileSync(expandedPath, "utf-8");
        }
        if (key.passphrase) {
          resolved.passphrase = key.passphrase;
        }
        return resolved;
      }
    }
    return config;
  }

  createSSHConnection(config: ServerConnection): Promise<Client> {
    return new Promise((resolve, reject) => {
      const existing = this.activeConnections.get(config.id);
      if (existing) {
        resolve(existing);
        return;
      }

      const resolved = this.resolveKeychainKey(config);
      const client = new Client();

      client.on("ready", () => {
        this.activeConnections.set(config.id, client);
        resolve(client);
      });

      client.on("error", (err) => {
        this.activeConnections.delete(config.id);
        reject(err);
      });

      client.on("close", () => {
        this.activeConnections.delete(config.id);
      });

      const connectConfig: Record<string, unknown> = {
        host: resolved.host,
        port: resolved.port,
        username: resolved.username,
        readyTimeout: 10000,
      };

      if (resolved.authMethod === "password") {
        connectConfig.password = resolved.password;
      } else if (resolved.authMethod === "key") {
        connectConfig.privateKey = resolved.privateKey;
        if (resolved.passphrase) {
          connectConfig.passphrase = resolved.passphrase;
        }
      }

      client.connect(connectConfig);
    });
  }

  disconnectSSH(connectionId: string) {
    const client = this.activeConnections.get(connectionId);
    if (client) {
      client.end();
      this.activeConnections.delete(connectionId);
    }
  }

  disconnectAll() {
    for (const [id, client] of this.activeConnections) {
      client.end();
      this.activeConnections.delete(id);
    }
  }
}
