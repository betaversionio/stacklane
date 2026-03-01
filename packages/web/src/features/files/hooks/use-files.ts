import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sftpApi } from "../api";

export function useFileList(connectionId: string, path: string) {
  return useQuery({
    queryKey: ["sftp", connectionId, path],
    queryFn: () => sftpApi.list(connectionId, path),
  });
}

export function useDeleteFile(connectionId: string, currentPath: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ path, isDir }: { path: string; isDir: boolean }) =>
      sftpApi.delete(connectionId, path, isDir),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sftp", connectionId, currentPath],
      }),
  });
}

export function useMkdir(
  connectionId: string,
  currentPath: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dirPath: string) => sftpApi.mkdir(connectionId, dirPath),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sftp", connectionId, currentPath],
      });
      onSuccess?.();
    },
  });
}

export function useUploadFile(connectionId: string, currentPath: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) =>
      sftpApi.upload(connectionId, currentPath, file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sftp", connectionId, currentPath],
      }),
  });
}
