import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CloudProviderCredentialInput,
  CloudProviderTestConnectionRequest,
  CloudResourceImportRequest,
} from '@stacklane/shared';
import { cloudProvidersApi } from '../api/cloud-providers.api';

export function useCloudProviders() {
  return useQuery({
    queryKey: ['cloud-providers'],
    queryFn: () => cloudProvidersApi.getAll(),
  });
}

export function useCloudProvider(id: string) {
  return useQuery({
    queryKey: ['cloud-providers', id],
    queryFn: () => cloudProvidersApi.getById(id),
    enabled: !!id,
  });
}

export function useTestCloudConnection() {
  return useMutation({
    mutationFn: (request: CloudProviderTestConnectionRequest) =>
      cloudProvidersApi.testConnection(request),
  });
}

export function useCreateCloudProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CloudProviderCredentialInput) => cloudProvidersApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cloud-providers'] });
    },
  });
}

export function useDeleteCloudProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cloudProvidersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cloud-providers'] });
    },
  });
}

export function useDiscoverCloudResources(id: string) {
  return useQuery({
    queryKey: ['cloud-providers', id, 'discover'],
    queryFn: () => cloudProvidersApi.discover(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useImportCloudResources() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CloudResourceImportRequest) => cloudProvidersApi.import(request),
    onSuccess: () => {
      // Invalidate servers and storage after import
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });
}
