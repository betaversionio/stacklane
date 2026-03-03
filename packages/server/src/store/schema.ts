import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const connections = sqliteTable('connections', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  host: text('host').notNull(),
  port: integer('port').notNull().default(22),
  username: text('username').notNull(),
  authMethod: text('authMethod', { enum: ['password', 'key'] }).notNull(),
  password: text('password'),
  privateKey: text('privateKey'),
  passphrase: text('passphrase'),
  keychainKeyId: text('keychainKeyId'),
  color: text('color'),
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
  systemInfo: text('systemInfo'),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});

export const storageCredentials = sqliteTable('storageCredentials', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: ['s3', 'gcs'] }).notNull(),
  provider: text('provider').notNull(),
  endpointUrl: text('endpointUrl'),
  region: text('region'),
  accessKeyId: text('accessKeyId'),
  secretAccessKey: text('secretAccessKey'),
  serviceAccountJson: text('serviceAccountJson'),
  defaultBucket: text('defaultBucket'),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});

export const sshKeys = sqliteTable('sshKeys', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: ['path', 'text'] }).notNull(),
  keyPath: text('keyPath'),
  keyContent: text('keyContent'),
  passphrase: text('passphrase'),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
});

// Join table for project-server many-to-many relationship
export const projectServers = sqliteTable(
  'projectServers',
  {
    projectId: text('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    serverId: text('serverId')
      .notNull()
      .references(() => connections.id, { onDelete: 'cascade' }),
    createdAt: text('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.serverId] }),
  }),
);

// Join table for project-storage many-to-many relationship
export const projectStorageCredentials = sqliteTable(
  'projectStorageCredentials',
  {
    projectId: text('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    credentialId: text('credentialId')
      .notNull()
      .references(() => storageCredentials.id, { onDelete: 'cascade' }),
    createdAt: text('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.credentialId] }),
  }),
);

// Relations for type-safe joins
export const projectsRelations = relations(projects, ({ many }) => ({
  projectServers: many(projectServers),
  projectStorageCredentials: many(projectStorageCredentials),
}));

export const connectionsRelations = relations(connections, ({ many }) => ({
  projectServers: many(projectServers),
}));

export const storageCredentialsRelations = relations(
  storageCredentials,
  ({ many }) => ({
    projectStorageCredentials: many(projectStorageCredentials),
  }),
);

export const projectServersRelations = relations(
  projectServers,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectServers.projectId],
      references: [projects.id],
    }),
    server: one(connections, {
      fields: [projectServers.serverId],
      references: [connections.id],
    }),
  }),
);

export const projectStorageCredentialsRelations = relations(
  projectStorageCredentials,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectStorageCredentials.projectId],
      references: [projects.id],
    }),
    credential: one(storageCredentials, {
      fields: [projectStorageCredentials.credentialId],
      references: [storageCredentials.id],
    }),
  }),
);
