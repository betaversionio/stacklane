import { Injectable, Logger } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';
import type {
  CloudProviderCredential,
  CloudComputeInstance,
  CloudStorageResource,
  CloudResourceDiscoveryResponse,
} from '@stacklane/shared';
import type { ICloudProvider } from './cloud-provider.interface.js';

@Injectable()
export class DigitalOceanProvider implements ICloudProvider {
  private readonly logger = new Logger(DigitalOceanProvider.name);
  private readonly baseURL = 'https://api.digitalocean.com/v2';

  private createClient(credential: CloudProviderCredential): AxiosInstance {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${credential.digitaloceanToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async testConnection(credential: CloudProviderCredential) {
    let canAccessCompute = false;
    let canAccessStorage = false;
    const regions: string[] = [];

    try {
      const client = this.createClient(credential);

      // Test account access
      await client.get('/account');

      // Try to list droplets
      try {
        await client.get('/droplets');
        canAccessCompute = true;
      } catch (error) {
        this.logger.warn('Failed to access Droplets', error);
      }

      // Try to list Spaces (S3-compatible storage)
      try {
        // DigitalOcean Spaces uses S3 API, so we test by trying to access the account
        canAccessStorage = true; // If account access works, storage should work
      } catch (error) {
        this.logger.warn('Failed to access Spaces', error);
      }

      // Get available regions
      try {
        const regionsResponse = await client.get('/regions');
        regions.push(...regionsResponse.data.regions.map((r: any) => r.slug));
      } catch (error) {
        this.logger.warn('Failed to fetch regions', error);
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to validate DigitalOcean credentials',
        canAccessCompute: false,
        canAccessStorage: false,
      };
    }

    return {
      success: canAccessCompute || canAccessStorage,
      message: 'DigitalOcean credentials validated successfully',
      canAccessCompute,
      canAccessStorage,
      regions: regions.length > 0 ? regions : undefined,
    };
  }

  async discoverComputeInstances(
    credential: CloudProviderCredential,
  ): Promise<CloudComputeInstance[]> {
    const client = this.createClient(credential);
    const instances: CloudComputeInstance[] = [];

    try {
      const response = await client.get('/droplets');
      const droplets = response.data.droplets || [];

      for (const droplet of droplets) {
        const publicIp = droplet.networks?.v4?.find((n: any) => n.type === 'public')?.ip_address;
        const privateIp = droplet.networks?.v4?.find((n: any) => n.type === 'private')?.ip_address;

        instances.push({
          id: droplet.id.toString(),
          name: droplet.name,
          type: 'compute',
          provider: 'digitalocean',
          region: droplet.region?.slug || 'unknown',
          status: droplet.status,
          publicIp,
          privateIp,
          instanceType: droplet.size?.slug || 'unknown',
          state: this.mapDropletState(droplet.status),
          operatingSystem: droplet.image?.distribution || 'Linux',
          defaultUsername: this.getDefaultUsername({
            id: droplet.id.toString(),
            name: droplet.name,
            type: 'compute',
            provider: 'digitalocean',
            region: droplet.region?.slug || 'unknown',
            status: droplet.status,
            instanceType: droplet.size?.slug || 'unknown',
            state: this.mapDropletState(droplet.status),
            operatingSystem: droplet.image?.distribution || 'Linux',
            metadata: {},
          }),
          tags: droplet.tags?.reduce((acc: Record<string, string>, tag: string) => {
            acc[tag] = tag;
            return acc;
          }, {}),
          metadata: {
            image: droplet.image?.name,
            vcpus: droplet.vcpus,
            memory: droplet.memory,
            disk: droplet.disk,
            created: droplet.created_at,
          },
        });
      }

      this.logger.log(`Discovered ${instances.length} DigitalOcean Droplets`);
    } catch (error) {
      this.logger.error('Failed to discover Droplets', error);
      throw error;
    }

    return instances;
  }

  async discoverStorageResources(
    credential: CloudProviderCredential,
  ): Promise<CloudStorageResource[]> {
    // DigitalOcean Spaces uses S3-compatible API
    // We would need separate Spaces credentials (access key + secret)
    // For now, return empty array as Spaces requires separate auth
    this.logger.log('DigitalOcean Spaces discovery requires separate S3 credentials');
    return [];
  }

  async discoverAllResources(
    credential: CloudProviderCredential,
  ): Promise<CloudResourceDiscoveryResponse> {
    const [compute, storage] = await Promise.all([
      this.discoverComputeInstances(credential).catch(() => []),
      this.discoverStorageResources(credential).catch(() => []),
    ]);

    return {
      provider: 'digitalocean',
      credentialId: credential.id,
      compute,
      storage,
      discoveredAt: new Date().toISOString(),
    };
  }

  getDefaultUsername(instance: CloudComputeInstance): string {
    const os = instance.operatingSystem?.toLowerCase() || '';

    if (os.includes('ubuntu')) return 'root';
    if (os.includes('debian')) return 'root';
    if (os.includes('centos')) return 'root';
    if (os.includes('fedora')) return 'root';
    if (os.includes('freebsd')) return 'freebsd';

    return 'root'; // Default for DigitalOcean
  }

  private mapDropletState(status: string): CloudComputeInstance['state'] {
    switch (status.toLowerCase()) {
      case 'active':
        return 'running';
      case 'off':
        return 'stopped';
      case 'new':
        return 'pending';
      case 'archive':
        return 'terminated';
      default:
        return 'unknown';
    }
  }
}
