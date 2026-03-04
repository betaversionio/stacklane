import type {
  CloudProviderCredential,
  CloudComputeInstance,
  CloudStorageResource,
  CloudResourceDiscoveryResponse,
} from '@stacklane/shared';

/**
 * Interface that all cloud provider implementations must follow
 */
export interface ICloudProvider {
  /**
   * Test if the credentials are valid and can access resources
   */
  testConnection(credential: CloudProviderCredential): Promise<{
    success: boolean;
    message: string;
    canAccessCompute: boolean;
    canAccessStorage: boolean;
    regions?: string[];
  }>;

  /**
   * Discover all compute resources (EC2, VMs, Droplets)
   */
  discoverComputeInstances(
    credential: CloudProviderCredential,
  ): Promise<CloudComputeInstance[]>;

  /**
   * Discover all storage resources (S3, GCS buckets, Spaces)
   */
  discoverStorageResources(
    credential: CloudProviderCredential,
  ): Promise<CloudStorageResource[]>;

  /**
   * Discover all resources (both compute and storage)
   */
  discoverAllResources(
    credential: CloudProviderCredential,
  ): Promise<CloudResourceDiscoveryResponse>;

  /**
   * Get SSH username for a given OS/AMI
   */
  getDefaultUsername(
    instance: CloudComputeInstance,
  ): string;
}
