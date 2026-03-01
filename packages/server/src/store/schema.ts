import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const connections = sqliteTable("connections", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  host: text("host").notNull(),
  port: integer("port").notNull().default(22),
  username: text("username").notNull(),
  authMethod: text("authMethod", { enum: ["password", "key"] }).notNull(),
  password: text("password"),
  privateKey: text("privateKey"),
  passphrase: text("passphrase"),
  keychainKeyId: text("keychainKeyId"),
  color: text("color"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const bucketCredentials = sqliteTable("bucketCredentials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["s3", "gcs"] }).notNull(),
  provider: text("provider").notNull(),
  endpointUrl: text("endpointUrl"),
  region: text("region"),
  accessKeyId: text("accessKeyId"),
  secretAccessKey: text("secretAccessKey"),
  serviceAccountJson: text("serviceAccountJson"),
  defaultBucket: text("defaultBucket"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const sshKeys = sqliteTable("sshKeys", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["path", "text"] }).notNull(),
  keyPath: text("keyPath"),
  keyContent: text("keyContent"),
  passphrase: text("passphrase"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});
