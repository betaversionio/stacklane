import { Injectable, Inject } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import type { ServerConnection, ServerConnectionInput } from "@stacklane/shared";
import { StoreService } from "../store/store.service.js";
import { SshService } from "../ssh/ssh.service.js";

@Injectable()
export class ConnectionsService {
  constructor(
    @Inject(StoreService) private readonly store: StoreService,
    @Inject(SshService) private readonly ssh: SshService
  ) {}

  list(): ServerConnection[] {
    return this.store.getConnections().map((c) => ({
      ...c,
      password: undefined,
      privateKey: undefined,
      passphrase: undefined,
    }));
  }

  get(id: string): ServerConnection | undefined {
    return this.store.getConnection(id);
  }

  create(input: ServerConnectionInput): ServerConnection {
    const now = new Date().toISOString();
    const connection: ServerConnection = {
      ...input,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    };
    this.store.addConnection(connection);
    return connection;
  }

  update(id: string, updates: Partial<ServerConnection>): ServerConnection | null {
    return this.store.updateConnection(id, updates);
  }

  delete(id: string): boolean {
    this.ssh.disconnectSSH(id);
    return this.store.deleteConnection(id);
  }

  async test(id: string): Promise<{ connected: boolean } | { error: string }> {
    const connection = this.store.getConnection(id);
    if (!connection) return { error: "Connection not found" };

    try {
      const client = await this.ssh.createSSHConnection(connection);
      client.end();
      return { connected: true };
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Connection failed";
      return { error };
    }
  }

  async testDirect(input: ServerConnectionInput): Promise<{ connected: boolean } | { error: string }> {
    const tempConnection: ServerConnection = {
      ...input,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const client = await this.ssh.createSSHConnection(tempConnection);
      client.end();
      this.ssh.disconnectSSH(tempConnection.id);
      return { connected: true };
    } catch (err: unknown) {
      this.ssh.disconnectSSH(tempConnection.id);
      const error = err instanceof Error ? err.message : "Connection failed";
      return { error };
    }
  }
}
