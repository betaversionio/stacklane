import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BucketCredentialInput, BucketCredential } from "@stacklane/shared";
import { bucketsApi } from "../api";

export function useBuckets() {
  return useQuery({
    queryKey: ["buckets"],
    queryFn: () => bucketsApi.list(),
  });
}

export function useCreateBucket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BucketCredentialInput) => bucketsApi.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["buckets"] }),
  });
}

export function useUpdateBucket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<BucketCredential>;
    }) => bucketsApi.update(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["buckets"] }),
  });
}

export function useDeleteBucket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bucketsApi.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["buckets"] }),
  });
}
