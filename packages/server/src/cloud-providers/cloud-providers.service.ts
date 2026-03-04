import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type {
  CloudProviderCredential,
  CloudProviderCredentialInput,
  CloudProviderType,
  CloudResourceDiscoveryResponse,
  CloudProviderTestConnectionRequest,
  CloudProviderTestConnectionResponse,
  CloudResourceImportRequest,
  CloudResourceImportResponse,
  ServerConnectionInput,
} from '@stacklane/shared';
import { StoreService } from '../store/store.service.js';
import { cloudProviderCredentials, connections as connectionsTable } from '../store/schema.js';
import { AWSProvider } from './aws.provider.js';
import { DigitalOceanProvider } from './digitalocean.provider.js';
import type { ICloudProvider } from './cloud-provider.interface.js';
import { ConnectionsService } from '../connections/connections.service.js';
import { StorageService } from '../storage/storage.service.js';

@Injectable()
export class CloudProvidersService {
  private readonly logger = new Logger(CloudProvidersService.name);
  private readonly providers: Map<CloudProviderType, ICloudProvider>;

  constructor(
    private readonly storeService: StoreService,
    private readonly connectionsService: ConnectionsService,
    private readonly storageService: StorageService,
  ) {
    // Register all cloud provider implementations
    this.providers = new Map();
    this.providers.set('aws', new AWSProvider());
    this.providers.set('digitalocean', new DigitalOceanProvider());
    // Add more providers here as we implement them:
    // this.providers.set('gcp', new GCPProvider());
    // this.providers.set('azure', new AzureProvider());
    // etc.
  }

  private getProvider(type: CloudProviderType): ICloudProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new NotFoundException(`Cloud provider ${type} not implemented yet`);
    }
    return provider;
  }

  /**
   * Test cloud provider credentials without saving
   */
  async testConnection(
    request: CloudProviderTestConnectionRequest,
  ): Promise<CloudProviderTestConnectionResponse> {
    const provider = this.getProvider(request.provider);

    // Create a temporary credential object for testing
    const tempCredential: CloudProviderCredential = {
      id: 'test',
      name: 'Test',
      provider: request.provider,
      ...request.credentials,
      isConnected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const result = await provider.testConnection(tempCredential);
      return result;
    } catch (error: any) {
      this.logger.error('Test connection failed', error);
      return {
        success: false,
        message: error.message || 'Connection test failed',
      };
    }
  }

  /**
   * Create and save cloud provider credentials
   */
  async createCredential(
    input: CloudProviderCredentialInput,
  ): Promise<CloudProviderCredential> {
    const now = new Date().toISOString();
    const id = uuidv4();

    const credential: CloudProviderCredential = {
      id,
      ...input,
      isConnected: false,
      createdAt: now,
      updatedAt: now,
    };

    // Test the connection first
    const provider = this.getProvider(input.provider);
    const testResult = await provider.testConnection(credential);

    if (!testResult.success) {
      throw new Error(`Failed to validate credentials: ${testResult.message}`);
    }

    credential.isConnected = true;

    await this.storeService.db.insert(cloudProviderCredentials).values(credential);

    this.logger.log(`Created cloud provider credential: ${credential.name} (${credential.provider})`);
    return credential;
  }

  /**
   * Get all cloud provider credentials
   */
  async getAllCredentials(): Promise<CloudProviderCredential[]> {
    return this.storeService.db.select().from(cloudProviderCredentials).all();
  }

  /**
   * Get a specific cloud provider credential
   */
  async getCredentialById(id: string): Promise<CloudProviderCredential> {
    const credential = await this.storeService.db
      .select()
      .from(cloudProviderCredentials)
      .where(eq(cloudProviderCredentials.id, id))
      .get();

    if (!credential) {
      throw new NotFoundException(`Cloud provider credential ${id} not found`);
    }

    return credential;
  }

  /**
   * Delete a cloud provider credential
   */
  async deleteCredential(id: string): Promise<void> {
    await this.storeService.db
      .delete(cloudProviderCredentials)
      .where(eq(cloudProviderCredentials.id, id))
      .run();

    this.logger.log(`Deleted cloud provider credential: ${id}`);
  }

  /**
   * Discover all resources (compute + storage) from a cloud provider
   */
  async discoverResources(credentialId: string): Promise<CloudResourceDiscoveryResponse> {
    const credential = await this.getCredentialById(credentialId);
    const provider = this.getProvider(credential.provider);

    this.logger.log(`Discovering resources for ${credential.provider}`);

    const discovery = await provider.discoverAllResources(credential);

    // Update last synced timestamp
    await this.storeService.db
      .update(cloudProviderCredentials)
      .set({
        lastSyncedAt: discovery.discoveredAt,
        updatedAt: discovery.discoveredAt,
      })
      .where(eq(cloudProviderCredentials.id, credentialId))
      .run();

    return discovery;
  }

  /**
   * Import selected cloud resources as servers and storage credentials
   */
  async importResources(
    request: CloudResourceImportRequest,
  ): Promise<CloudResourceImportResponse> {
    const credential = await this.getCredentialById(request.credentialId);
    const provider = this.getProvider(credential.provider);
    const discovery = await provider.discoverAllResources(credential);

    let serversImported = 0;
    let storageImported = 0;
    const errors: string[] = [];

    // Import compute instances as servers
    for (const instanceId of request.computeInstances) {
      const instance = discovery.compute.find((c) => c.id === instanceId);
      if (!instance) {
        errors.push(`Compute instance ${instanceId} not found`);
        continue;
      }

      try {
        const serverInput: ServerConnectionInput = {
          name: instance.name,
          host: instance.publicIp || instance.privateIp || '',
          port: 22,
          username: instance.defaultUsername || 'root',
          authMethod: 'key',
          password: '',
          privateKey: '',
          color: this.getProviderColor(credential.provider),
          tags: [credential.provider.toUpperCase(), instance.region],
        };

        const server = await this.connectionsService.create(serverInput);

        // Link server to cloud provider
        await this.storeService.db
          .update(connectionsTable)
          .set({
            cloudProviderId: credential.id,
            cloudInstanceId: instance.id,
            cloudMetadata: instance.metadata,
          })
          .where(eq(connectionsTable.id, server.id))
          .run();

        serversImported++;
        this.logger.log(`Imported server: ${instance.name}`);
      } catch (error: any) {
        errors.push(`Failed to import ${instance.name}: ${error.message}`);
        this.logger.error(`Failed to import server ${instance.name}`, error);
      }
    }

    // Import storage resources
    for (const storageId of request.storageResources) {
      const storage = discovery.storage.find((s) => s.id === storageId);
      if (!storage) {
        errors.push(`Storage resource ${storageId} not found`);
        continue;
      }

      try {
        // Create storage credential based on provider
        const storageInput: any = {
          name: storage.bucketName,
          type: 's3', // Most providers use S3-compatible storage
          provider: credential.provider,
          region: storage.region,
          endpointUrl: storage.endpoint,
        };

        // Add provider-specific credentials
        if (credential.provider === 'aws') {
          storageInput.accessKeyId = credential.awsAccessKeyId;
          storageInput.secretAccessKey = credential.awsSecretAccessKey;
        } else if (credential.provider === 'digitalocean') {
          // DigitalOcean Spaces needs separate credentials
          // For now, skip auto-import
          errors.push(`${storage.bucketName}: DigitalOcean Spaces require separate credentials`);
          continue;
        }

        await this.storageService.create(storageInput);
        storageImported++;
        this.logger.log(`Imported storage: ${storage.bucketName}`);
      } catch (error: any) {
        errors.push(`Failed to import ${storage.bucketName}: ${error.message}`);
        this.logger.error(`Failed to import storage ${storage.bucketName}`, error);
      }
    }

    return {
      success: serversImported > 0 || storageImported > 0,
      serversImported,
      storageImported,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  private getProviderColor(provider: CloudProviderType): string {
    const colors: Record<CloudProviderType, string> = {
      aws: '#FF9900',
      gcp: '#4285F4',
      azure: '#0078D4',
      digitalocean: '#0080FF',
      linode: '#00A95C',
      hetzner: '#D50C2D',
      vultr: '#007BFC',
    };
    return colors[provider] || '#6366f1';
  }
}
