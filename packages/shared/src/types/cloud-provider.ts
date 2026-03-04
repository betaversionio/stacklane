// Cloud provider types
export type CloudProviderType =
  | 'aws'
  | 'gcp'
  | 'azure'
  | 'digitalocean'
  | 'linode'
  | 'hetzner'
  | 'vultr';

export type CloudResourceType = 'compute' | 'storage';

// Cloud provider credentials
export interface CloudProviderCredential {
  id: string;
  name: string;
  provider: CloudProviderType;
  // AWS fields
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsRegion?: string;
  // GCP fields
  gcpProjectId?: string;
  gcpServiceAccountJson?: string;
  // Azure fields
  azureSubscriptionId?: string;
  azureTenantId?: string;
  azureClientId?: string;
  azureClientSecret?: string;
  // DigitalOcean fields
  digitaloceanToken?: string;
  // Linode fields
  linodeToken?: string;
  // Hetzner fields
  hetznerToken?: string;
  // Vultr fields
  vultrApiKey?: string;
  // Metadata
  isConnected: boolean;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CloudProviderCredentialInput {
  name: string;
  provider: CloudProviderType;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsRegion?: string;
  gcpProjectId?: string;
  gcpServiceAccountJson?: string;
  azureSubscriptionId?: string;
  azureTenantId?: string;
  azureClientId?: string;
  azureClientSecret?: string;
  digitaloceanToken?: string;
  linodeToken?: string;
  hetznerToken?: string;
  vultrApiKey?: string;
}

// Generic cloud resource (compute or storage)
export interface CloudResource {
  id: string; // Cloud provider's resource ID
  name: string;
  type: CloudResourceType;
  provider: CloudProviderType;
  region: string;
  status: string;
  metadata: Record<string, any>;
}

// Compute resource (EC2, VM, Droplet, etc.)
export interface CloudComputeInstance extends CloudResource {
  type: 'compute';
  publicIp?: string;
  privateIp?: string;
  instanceType: string; // t2.micro, e2-medium, Standard_B1s, s-1vcpu-1gb, etc.
  state: 'running' | 'stopped' | 'pending' | 'terminated' | 'unknown';
  operatingSystem?: string;
  defaultUsername?: string; // ubuntu, ec2-user, root, etc.
  tags?: Record<string, string>;
}

// Storage resource (S3, GCS, Blob Storage, Spaces, etc.)
export interface CloudStorageResource extends CloudResource {
  type: 'storage';
  bucketName: string;
  size?: number;
  objectCount?: number;
  storageClass?: string;
  isPublic?: boolean;
  endpoint?: string;
}

// Discovery response
export interface CloudResourceDiscoveryResponse {
  provider: CloudProviderType;
  credentialId: string;
  compute: CloudComputeInstance[];
  storage: CloudStorageResource[];
  discoveredAt: string;
}

// Import request
export interface CloudResourceImportRequest {
  credentialId: string;
  computeInstances: string[]; // Array of instance IDs to import
  storageResources: string[]; // Array of bucket names/IDs to import
}

// Import response
export interface CloudResourceImportResponse {
  success: boolean;
  serversImported: number;
  storageImported: number;
  errors?: string[];
}

// Test connection request
export interface CloudProviderTestConnectionRequest {
  provider: CloudProviderType;
  credentials: Omit<CloudProviderCredentialInput, 'name'>;
}

// Test connection response
export interface CloudProviderTestConnectionResponse {
  success: boolean;
  message: string;
  details?: {
    canAccessCompute: boolean;
    canAccessStorage: boolean;
    regions?: string[];
  };
}
