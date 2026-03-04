import { Injectable, Logger } from '@nestjs/common';
import { EC2Client, DescribeInstancesCommand, DescribeRegionsCommand } from '@aws-sdk/client-ec2';
import { S3Client, ListBucketsCommand, GetBucketLocationCommand } from '@aws-sdk/client-s3';
import type {
  CloudProviderCredential,
  CloudComputeInstance,
  CloudStorageResource,
  CloudResourceDiscoveryResponse,
} from '@stacklane/shared';
import type { ICloudProvider } from './cloud-provider.interface.js';

@Injectable()
export class AWSProvider implements ICloudProvider {
  private readonly logger = new Logger(AWSProvider.name);

  private createEC2Client(credential: CloudProviderCredential): EC2Client {
    return new EC2Client({
      region: credential.awsRegion || 'us-east-1',
      credentials: {
        accessKeyId: credential.awsAccessKeyId!,
        secretAccessKey: credential.awsSecretAccessKey!,
      },
    });
  }

  private createS3Client(credential: CloudProviderCredential): S3Client {
    return new S3Client({
      region: credential.awsRegion || 'us-east-1',
      credentials: {
        accessKeyId: credential.awsAccessKeyId!,
        secretAccessKey: credential.awsSecretAccessKey!,
      },
    });
  }

  async testConnection(credential: CloudProviderCredential) {
    let canAccessCompute = false;
    let canAccessStorage = false;
    const regions: string[] = [];

    try {
      // Test EC2 access
      const ec2Client = this.createEC2Client(credential);
      const regionsCommand = new DescribeRegionsCommand({});
      const regionsResult = await ec2Client.send(regionsCommand);
      canAccessCompute = true;
      regions.push(...(regionsResult.Regions?.map((r) => r.RegionName!).filter(Boolean) || []));
    } catch (error) {
      this.logger.warn('Failed to access EC2', error);
    }

    try {
      // Test S3 access
      const s3Client = this.createS3Client(credential);
      const bucketsCommand = new ListBucketsCommand({});
      await s3Client.send(bucketsCommand);
      canAccessStorage = true;
    } catch (error) {
      this.logger.warn('Failed to access S3', error);
    }

    const success = canAccessCompute || canAccessStorage;

    return {
      success,
      message: success
        ? 'AWS credentials validated successfully'
        : 'Failed to validate AWS credentials',
      canAccessCompute,
      canAccessStorage,
      regions: regions.length > 0 ? regions : undefined,
    };
  }

  async discoverComputeInstances(
    credential: CloudProviderCredential,
  ): Promise<CloudComputeInstance[]> {
    const ec2Client = this.createEC2Client(credential);
    const instances: CloudComputeInstance[] = [];

    try {
      const command = new DescribeInstancesCommand({});
      const result = await ec2Client.send(command);

      for (const reservation of result.Reservations || []) {
        for (const instance of reservation.Instances || []) {
          if (!instance.InstanceId) continue;

          const nameTag = instance.Tags?.find((t) => t.Key === 'Name');
          const state = this.mapEC2State(instance.State?.Name || 'unknown');

          instances.push({
            id: instance.InstanceId,
            name: nameTag?.Value || instance.InstanceId,
            type: 'compute',
            provider: 'aws',
            region: credential.awsRegion || 'us-east-1',
            status: state,
            publicIp: instance.PublicIpAddress,
            privateIp: instance.PrivateIpAddress,
            instanceType: instance.InstanceType || 'unknown',
            state,
            operatingSystem: this.detectOS(instance.Platform, instance.ImageId),
            defaultUsername: this.getDefaultUsername({
              id: instance.InstanceId,
              name: nameTag?.Value || instance.InstanceId,
              type: 'compute',
              provider: 'aws',
              region: credential.awsRegion || 'us-east-1',
              status: state,
              instanceType: instance.InstanceType || 'unknown',
              state,
              operatingSystem: this.detectOS(instance.Platform, instance.ImageId),
              metadata: {},
            }),
            tags: instance.Tags?.reduce((acc, tag) => {
              if (tag.Key && tag.Value) {
                acc[tag.Key] = tag.Value;
              }
              return acc;
            }, {} as Record<string, string>),
            metadata: {
              imageId: instance.ImageId,
              launchTime: instance.LaunchTime,
              vpcId: instance.VpcId,
              subnetId: instance.SubnetId,
              platform: instance.Platform,
            },
          });
        }
      }

      this.logger.log(`Discovered ${instances.length} EC2 instances`);
    } catch (error) {
      this.logger.error('Failed to discover EC2 instances', error);
      throw error;
    }

    return instances;
  }

  async discoverStorageResources(
    credential: CloudProviderCredential,
  ): Promise<CloudStorageResource[]> {
    const s3Client = this.createS3Client(credential);
    const buckets: CloudStorageResource[] = [];

    try {
      const listCommand = new ListBucketsCommand({});
      const result = await s3Client.send(listCommand);

      for (const bucket of result.Buckets || []) {
        if (!bucket.Name) continue;

        let region = credential.awsRegion || 'us-east-1';
        try {
          const locationCommand = new GetBucketLocationCommand({
            Bucket: bucket.Name,
          });
          const locationResult = await s3Client.send(locationCommand);
          region = locationResult.LocationConstraint || 'us-east-1';
        } catch (error) {
          this.logger.warn(`Failed to get location for bucket ${bucket.Name}`);
        }

        buckets.push({
          id: bucket.Name,
          name: bucket.Name,
          type: 'storage',
          provider: 'aws',
          region,
          status: 'active',
          bucketName: bucket.Name,
          endpoint: `https://${bucket.Name}.s3.${region}.amazonaws.com`,
          metadata: {
            creationDate: bucket.CreationDate,
          },
        });
      }

      this.logger.log(`Discovered ${buckets.length} S3 buckets`);
    } catch (error) {
      this.logger.error('Failed to discover S3 buckets', error);
      throw error;
    }

    return buckets;
  }

  async discoverAllResources(
    credential: CloudProviderCredential,
  ): Promise<CloudResourceDiscoveryResponse> {
    const [compute, storage] = await Promise.all([
      this.discoverComputeInstances(credential).catch(() => []),
      this.discoverStorageResources(credential).catch(() => []),
    ]);

    return {
      provider: 'aws',
      credentialId: credential.id,
      compute,
      storage,
      discoveredAt: new Date().toISOString(),
    };
  }

  getDefaultUsername(instance: CloudComputeInstance): string {
    const os = instance.operatingSystem?.toLowerCase() || '';

    if (os.includes('ubuntu')) return 'ubuntu';
    if (os.includes('amazon') || os.includes('amzn')) return 'ec2-user';
    if (os.includes('centos')) return 'centos';
    if (os.includes('debian')) return 'admin';
    if (os.includes('fedora')) return 'fedora';
    if (os.includes('rhel') || os.includes('red hat')) return 'ec2-user';
    if (os.includes('suse')) return 'ec2-user';
    if (os.includes('windows')) return 'Administrator';

    return 'ec2-user'; // Default fallback
  }

  private mapEC2State(state: string): CloudComputeInstance['state'] {
    switch (state.toLowerCase()) {
      case 'running':
        return 'running';
      case 'stopped':
      case 'stopping':
        return 'stopped';
      case 'pending':
        return 'pending';
      case 'terminated':
      case 'terminating':
        return 'terminated';
      default:
        return 'unknown';
    }
  }

  private detectOS(platform?: string, imageId?: string): string {
    if (platform?.toLowerCase() === 'windows') {
      return 'Windows';
    }

    // Common AMI patterns
    if (imageId?.includes('ubuntu')) return 'Ubuntu';
    if (imageId?.includes('amzn')) return 'Amazon Linux';
    if (imageId?.includes('rhel')) return 'Red Hat Enterprise Linux';
    if (imageId?.includes('centos')) return 'CentOS';
    if (imageId?.includes('debian')) return 'Debian';

    return 'Linux'; // Default
  }
}
