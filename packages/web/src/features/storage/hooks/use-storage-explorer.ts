import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storageApi } from "../api";

export function useStorageBucketList(credentialId: string) {
  return useQuery({
    queryKey: ["storage-explorer", credentialId, "buckets"],
    queryFn: () => storageApi.listBuckets(credentialId),
    enabled: !!credentialId,
  });
}

export function useStorageBucketObjects(
  credentialId: string,
  bucket: string,
  prefix?: string,
) {
  return useInfiniteQuery({
    queryKey: ["storage-explorer", credentialId, bucket, "objects", prefix ?? ""],
    queryFn: ({ pageParam }) =>
      storageApi.listObjects(credentialId, bucket, prefix, pageParam || undefined),
    initialPageParam: "" as string,
    getNextPageParam: (lastPage) =>
      lastPage.data?.isTruncated ? (lastPage.data.nextContinuationToken ?? null) : null,
    enabled: !!credentialId && !!bucket,
  });
}

export function useStorageBucketStats(credentialId: string, bucket: string) {
  return useQuery({
    queryKey: ["storage-explorer", credentialId, bucket, "stats"],
    queryFn: () => storageApi.getStats(credentialId, bucket),
    enabled: !!credentialId && !!bucket,
  });
}

export function useDeleteObject(
  credentialId: string,
  bucket: string,
  prefix?: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) =>
      storageApi.deleteObject(credentialId, bucket, key),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storage-explorer", credentialId, bucket, "objects", prefix ?? ""],
      });
      queryClient.invalidateQueries({
        queryKey: ["storage-explorer", credentialId, bucket, "stats"],
      });
    },
  });
}

export function useDeleteFolder(
  credentialId: string,
  bucket: string,
  prefix?: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderPrefix: string) =>
      storageApi.deleteFolder(credentialId, bucket, folderPrefix),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storage-explorer", credentialId, bucket, "objects", prefix ?? ""],
      });
      queryClient.invalidateQueries({
        queryKey: ["storage-explorer", credentialId, bucket, "stats"],
      });
    },
  });
}

export function useUploadObject(
  credentialId: string,
  bucket: string,
  prefix?: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      storageApi.uploadObject(credentialId, bucket, prefix ?? "", file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storage-explorer", credentialId, bucket, "objects", prefix ?? ""],
      });
      queryClient.invalidateQueries({
        queryKey: ["storage-explorer", credentialId, bucket, "stats"],
      });
    },
  });
}
