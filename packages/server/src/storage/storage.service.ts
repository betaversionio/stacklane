import { Injectable, Inject } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import type { StorageCredential, StorageCredentialInput } from "@stacklane/shared";
import { StoreService } from "../store/store.service.js";

@Injectable()
export class StorageService {
  constructor(
    @Inject(StoreService) private readonly store: StoreService
  ) {}

  list(): StorageCredential[] {
    return this.store.getStorageCredentials().map((c) => {
      if (c.type === "gcs") {
        return { ...c, serviceAccountJson: undefined };
      }
      return { ...c, secretAccessKey: undefined };
    });
  }

  get(id: string): StorageCredential | undefined {
    return this.store.getStorageCredential(id);
  }

  create(input: StorageCredentialInput): StorageCredential {
    const now = new Date().toISOString();
    const cred = {
      ...input,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    } as StorageCredential;
    this.store.addStorageCredential(cred);
    return cred;
  }

  update(id: string, updates: Partial<StorageCredential>): StorageCredential | null {
    return this.store.updateStorageCredential(id, updates);
  }

  delete(id: string): boolean {
    return this.store.deleteStorageCredential(id);
  }
}
