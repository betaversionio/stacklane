export interface StorageCredentialBase {
  id: string;
  name: string;
  defaultBucket?: string;
  createdAt: string;
  updatedAt: string;
}

export interface S3StorageCredential extends StorageCredentialBase {
  type: "s3";
  provider: "s3" | "r2" | "minio" | "other";
  endpointUrl: string;
  region: string;
  accessKeyId: string;
  secretAccessKey?: string;
}

export interface GCSStorageCredential extends StorageCredentialBase {
  type: "gcs";
  provider: "gcs";
  serviceAccountJson?: string;
}

export type StorageCredential = S3StorageCredential | GCSStorageCredential;

export type S3StorageCredentialInput = Omit<
  S3StorageCredential,
  "id" | "createdAt" | "updatedAt"
>;

export type GCSStorageCredentialInput = Omit<
  GCSStorageCredential,
  "id" | "createdAt" | "updatedAt"
>;

export type StorageCredentialInput =
  | S3StorageCredentialInput
  | GCSStorageCredentialInput;

// --- Bucket exploration types ---

export interface BucketInfo {
  name: string;
  creationDate?: string;
  region?: string;
}

export interface BucketObject {
  key: string;
  name: string;
  size: number;
  lastModified: string;
  etag?: string;
  storageClass?: string;
  isFolder: boolean;
}

export interface BucketObjectListing {
  objects: BucketObject[];
  folders: string[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}

export interface BucketStats {
  totalObjects: number;
  totalSize: number;
}
