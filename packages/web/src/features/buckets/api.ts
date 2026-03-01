import type { BucketCredential, BucketCredentialInput } from "@stacklane/shared";
import { request } from "@/lib/api";

export const bucketsApi = {
  list: () => request<BucketCredential[]>("/buckets"),
  get: (id: string) => request<BucketCredential>(`/buckets/${id}`),
  create: (data: BucketCredentialInput) =>
    request<BucketCredential>("/buckets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<BucketCredential>) =>
    request<BucketCredential>(`/buckets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request(`/buckets/${id}`, { method: "DELETE" }),
};
