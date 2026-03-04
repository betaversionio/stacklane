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
  tags: text('tags', { mode: 'json' }).$type<string[] | null>(),
  systemInfo: text('systemInfo'),
  // Cloud provider integration
  cloudProviderId: text('cloudProviderId'),
  cloudInstanceId: text('cloudInstanceId'), // EC2 instance ID, Droplet ID, etc.
  cloudMetadata: text('cloudMetadata', { mode: 'json' }).$type<Record<string, any> | null>(),
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

export const cloudProviderCredentials = sqliteTable('cloudProviderCredentials', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  provider: text('provider', {
    enum: ['aws', 'gcp', 'azure', 'digitalocean', 'linode', 'hetzner', 'vultr'],
  }).notNull(),
  // AWS fields
  awsAccessKeyId: text('awsAccessKeyId'),
  awsSecretAccessKey: text('awsSecretAccessKey'),
  awsRegion: text('awsRegion'),
  // GCP fields
  gcpProjectId: text('gcpProjectId'),
  gcpServiceAccountJson: text('gcpServiceAccountJson'),
  // Azure fields
  azureSubscriptionId: text('azureSubscriptionId'),
  azureTenantId: text('azureTenantId'),
  azureClientId: text('azureClientId'),
  azureClientSecret: text('azureClientSecret'),
  // DigitalOcean fields
  digitaloceanToken: text('digitaloceanToken'),
  // Linode fields
  linodeToken: text('linodeToken'),
  // Hetzner fields
  hetznerToken: text('hetznerToken'),
  // Vultr fields
  vultrApiKey: text('vultrApiKey'),
  // Metadata
  isConnected: integer('isConnected', { mode: 'boolean' }).default(false),
  lastSyncedAt: text('lastSyncedAt'),
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

export const connectionsRelations = relations(connections, ({ many, one }) => ({
  projectServers: many(projectServers),
  cloudProvider: one(cloudProviderCredentials, {
    fields: [connections.cloudProviderId],
    references: [cloudProviderCredentials.id],
  }),
}));

export const cloudProviderCredentialsRelations = relations(
  cloudProviderCredentials,
  ({ many }) => ({
    connections: many(connections),
  }),
);

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
