import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import fs from "fs";
import path from "path";
import os from "os";
import type { ServerConnection, SSHKey, BucketCredential } from "@stacklane/shared";
import initSqlJs from "sql.js";
import { drizzle, type SQLJsDatabase } from "drizzle-orm/sql-js";
import { eq } from "drizzle-orm";
import { connections, sshKeys, bucketCredentials } from "./schema.js";

const DATA_DIR = path.join(os.homedir(), ".stacklane");
const DB_FILE = path.join(DATA_DIR, "data.db");

@Injectable()
export class StoreService implements OnModuleInit {
  private readonly logger = new Logger(StoreService.name);
  private db!: SQLJsDatabase;
  private sqlite!: InstanceType<Awaited<ReturnType<typeof initSqlJs>>["Database"]>;

  async onModuleInit() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const SQL = await initSqlJs();

    if (fs.existsSync(DB_FILE)) {
      const fileBuffer = fs.readFileSync(DB_FILE);
      this.sqlite = new SQL.Database(fileBuffer);
    } else {
      this.sqlite = new SQL.Database();
    }

    this.db = drizzle(this.sqlite);

    this.sqlite.run(`
      CREATE TABLE IF NOT EXISTS connections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        host TEXT NOT NULL,
        port INTEGER NOT NULL DEFAULT 22,
        username TEXT NOT NULL,
        authMethod TEXT NOT NULL CHECK(authMethod IN ('password', 'key')),
        password TEXT,
        privateKey TEXT,
        passphrase TEXT,
        keychainKeyId TEXT,
        color TEXT,
        tags TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    this.sqlite.run(`
      CREATE TABLE IF NOT EXISTS sshKeys (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('path', 'text')),
        keyPath TEXT,
        keyContent TEXT,
        passphrase TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    this.sqlite.run(`
      CREATE TABLE IF NOT EXISTS bucketCredentials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('s3', 'gcs')),
        provider TEXT NOT NULL,
        endpointUrl TEXT,
        region TEXT,
        accessKeyId TEXT,
        secretAccessKey TEXT,
        serviceAccountJson TEXT,
        defaultBucket TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // Migration: add keychainKeyId to connections if missing
    try {
      this.sqlite.run(`ALTER TABLE connections ADD COLUMN keychainKeyId TEXT`);
    } catch {
      // Column already exists
    }

    this.persistToDisk();
    this.logger.log("Database initialization complete");
  }

  private persistToDisk() {
    const data = this.sqlite.export();
    fs.writeFileSync(DB_FILE, Buffer.from(data));
  }

  private rowToConnection(
    row: typeof connections.$inferSelect
  ): ServerConnection {
    return {
      ...row,
      password: row.password ?? undefined,
      privateKey: row.privateKey ?? undefined,
      passphrase: row.passphrase ?? undefined,
      keychainKeyId: row.keychainKeyId ?? undefined,
      color: row.color ?? undefined,
      tags: row.tags ?? undefined,
    };
  }

  private rowToSSHKey(row: typeof sshKeys.$inferSelect): SSHKey {
    return {
      ...row,
      keyPath: row.keyPath ?? undefined,
      keyContent: row.keyContent ?? undefined,
      passphrase: row.passphrase ?? undefined,
    };
  }

  getConnections(): ServerConnection[] {
    const rows = this.db.select().from(connections).all();
    return rows.map((r: typeof connections.$inferSelect) =>
      this.rowToConnection(r)
    );
  }

  getConnection(id: string): ServerConnection | undefined {
    const row = this.db
      .select()
      .from(connections)
      .where(eq(connections.id, id))
      .get();
    return row ? this.rowToConnection(row) : undefined;
  }

  addConnection(connection: ServerConnection): ServerConnection {
    this.db.insert(connections).values({
      id: connection.id,
      name: connection.name,
      host: connection.host,
      port: connection.port,
      username: connection.username,
      authMethod: connection.authMethod,
      password: connection.password ?? null,
      privateKey: connection.privateKey ?? null,
      passphrase: connection.passphrase ?? null,
      keychainKeyId: connection.keychainKeyId ?? null,
      color: connection.color ?? null,
      tags: connection.tags ?? null,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    }).run();
    this.persistToDisk();
    return connection;
  }

  updateConnection(
    id: string,
    updates: Partial<ServerConnection>
  ): ServerConnection | null {
    const existing = this.getConnection(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.db
      .update(connections)
      .set({
        name: merged.name,
        host: merged.host,
        port: merged.port,
        username: merged.username,
        authMethod: merged.authMethod,
        password: merged.password ?? null,
        privateKey: merged.privateKey ?? null,
        passphrase: merged.passphrase ?? null,
        keychainKeyId: merged.keychainKeyId ?? null,
        color: merged.color ?? null,
        tags: merged.tags ?? null,
        updatedAt: merged.updatedAt,
      })
      .where(eq(connections.id, id))
      .run();

    this.persistToDisk();
    return merged;
  }

  deleteConnection(id: string): boolean {
    const existing = this.getConnection(id);
    if (!existing) return false;
    this.db.delete(connections).where(eq(connections.id, id)).run();
    this.persistToDisk();
    return true;
  }

  // --- SSH Keys (Keychain) ---

  getSSHKeys(): SSHKey[] {
    const rows = this.db.select().from(sshKeys).all();
    return rows.map((r: typeof sshKeys.$inferSelect) => this.rowToSSHKey(r));
  }

  getSSHKey(id: string): SSHKey | undefined {
    const row = this.db
      .select()
      .from(sshKeys)
      .where(eq(sshKeys.id, id))
      .get();
    return row ? this.rowToSSHKey(row) : undefined;
  }

  addSSHKey(key: SSHKey): SSHKey {
    this.db.insert(sshKeys).values({
      id: key.id,
      name: key.name,
      type: key.type,
      keyPath: key.keyPath ?? null,
      keyContent: key.keyContent ?? null,
      passphrase: key.passphrase ?? null,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
    }).run();
    this.persistToDisk();
    return key;
  }

  updateSSHKey(id: string, updates: Partial<SSHKey>): SSHKey | null {
    const existing = this.getSSHKey(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.db
      .update(sshKeys)
      .set({
        name: merged.name,
        type: merged.type,
        keyPath: merged.keyPath ?? null,
        keyContent: merged.keyContent ?? null,
        passphrase: merged.passphrase ?? null,
        updatedAt: merged.updatedAt,
      })
      .where(eq(sshKeys.id, id))
      .run();

    this.persistToDisk();
    return merged;
  }

  deleteSSHKey(id: string): boolean {
    const existing = this.getSSHKey(id);
    if (!existing) return false;
    this.db.delete(sshKeys).where(eq(sshKeys.id, id)).run();
    this.persistToDisk();
    return true;
  }

  // --- Bucket Credentials ---

  private rowToBucketCredential(
    row: typeof bucketCredentials.$inferSelect
  ): BucketCredential {
    if (row.type === "gcs") {
      return {
        id: row.id,
        name: row.name,
        type: "gcs",
        provider: "gcs",
        serviceAccountJson: row.serviceAccountJson ?? undefined,
        defaultBucket: row.defaultBucket ?? undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    }
    return {
      id: row.id,
      name: row.name,
      type: "s3",
      provider: row.provider as "s3" | "r2" | "minio" | "other",
      endpointUrl: row.endpointUrl ?? "",
      region: row.region ?? "",
      accessKeyId: row.accessKeyId ?? "",
      secretAccessKey: row.secretAccessKey ?? undefined,
      defaultBucket: row.defaultBucket ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  getBucketCredentials(): BucketCredential[] {
    const rows = this.db.select().from(bucketCredentials).all();
    return rows.map((r: typeof bucketCredentials.$inferSelect) =>
      this.rowToBucketCredential(r)
    );
  }

  getBucketCredential(id: string): BucketCredential | undefined {
    const row = this.db
      .select()
      .from(bucketCredentials)
      .where(eq(bucketCredentials.id, id))
      .get();
    return row ? this.rowToBucketCredential(row) : undefined;
  }

  addBucketCredential(cred: BucketCredential): BucketCredential {
    this.db.insert(bucketCredentials).values({
      id: cred.id,
      name: cred.name,
      type: cred.type,
      provider: cred.provider,
      endpointUrl: cred.type === "s3" ? cred.endpointUrl : null,
      region: cred.type === "s3" ? cred.region : null,
      accessKeyId: cred.type === "s3" ? cred.accessKeyId : null,
      secretAccessKey: cred.type === "s3" ? cred.secretAccessKey ?? null : null,
      serviceAccountJson: cred.type === "gcs" ? cred.serviceAccountJson ?? null : null,
      defaultBucket: cred.defaultBucket ?? null,
      createdAt: cred.createdAt,
      updatedAt: cred.updatedAt,
    }).run();
    this.persistToDisk();
    return cred;
  }

  updateBucketCredential(
    id: string,
    updates: Partial<BucketCredential>
  ): BucketCredential | null {
    const existing = this.getBucketCredential(id);
    if (!existing) return null;

    const merged = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    } as BucketCredential;

    this.db
      .update(bucketCredentials)
      .set({
        name: merged.name,
        type: merged.type,
        provider: merged.provider,
        endpointUrl: merged.type === "s3" ? merged.endpointUrl : null,
        region: merged.type === "s3" ? merged.region : null,
        accessKeyId: merged.type === "s3" ? merged.accessKeyId : null,
        secretAccessKey: merged.type === "s3" ? merged.secretAccessKey ?? null : null,
        serviceAccountJson: merged.type === "gcs" ? merged.serviceAccountJson ?? null : null,
        defaultBucket: merged.defaultBucket ?? null,
        updatedAt: merged.updatedAt,
      })
      .where(eq(bucketCredentials.id, id))
      .run();

    this.persistToDisk();
    return merged;
  }

  deleteBucketCredential(id: string): boolean {
    const existing = this.getBucketCredential(id);
    if (!existing) return false;
    this.db.delete(bucketCredentials).where(eq(bucketCredentials.id, id)).run();
    this.persistToDisk();
    return true;
  }
}
