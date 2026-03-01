export interface BucketCredentialBase {
  id: string;
  name: string;
  defaultBucket?: string;
  createdAt: string;
  updatedAt: string;
}

export interface S3BucketCredential extends BucketCredentialBase {
  type: "s3";
  provider: "s3" | "r2" | "minio" | "other";
  endpointUrl: string;
  region: string;
  accessKeyId: string;
  secretAccessKey?: string;
}

export interface GCSBucketCredential extends BucketCredentialBase {
  type: "gcs";
  provider: "gcs";
  serviceAccountJson?: string;
}

export type BucketCredential = S3BucketCredential | GCSBucketCredential;

export type S3BucketCredentialInput = Omit<
  S3BucketCredential,
  "id" | "createdAt" | "updatedAt"
>;

export type GCSBucketCredentialInput = Omit<
  GCSBucketCredential,
  "id" | "createdAt" | "updatedAt"
>;

export type BucketCredentialInput =
  | S3BucketCredentialInput
  | GCSBucketCredentialInput;
