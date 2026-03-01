import { Injectable, Inject } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import type { BucketCredential, BucketCredentialInput } from "@stacklane/shared";
import { StoreService } from "../store/store.service.js";

@Injectable()
export class BucketsService {
  constructor(
    @Inject(StoreService) private readonly store: StoreService
  ) {}

  list(): BucketCredential[] {
    return this.store.getBucketCredentials().map((c) => {
      if (c.type === "gcs") {
        return { ...c, serviceAccountJson: undefined };
      }
      return { ...c, secretAccessKey: undefined };
    });
  }

  get(id: string): BucketCredential | undefined {
    return this.store.getBucketCredential(id);
  }

  create(input: BucketCredentialInput): BucketCredential {
    const now = new Date().toISOString();
    const cred = {
      ...input,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    } as BucketCredential;
    this.store.addBucketCredential(cred);
    return cred;
  }

  update(id: string, updates: Partial<BucketCredential>): BucketCredential | null {
    return this.store.updateBucketCredential(id, updates);
  }

  delete(id: string): boolean {
    return this.store.deleteBucketCredential(id);
  }
}
