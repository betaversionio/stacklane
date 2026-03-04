import type {
  ApiResponse,
  CloudProviderCredential,
  CloudProviderCredentialInput,
  CloudProviderTestConnectionRequest,
  CloudProviderTestConnectionResponse,
  CloudResourceDiscoveryResponse,
  CloudResourceImportRequest,
  CloudResourceImportResponse,
} from '@stacklane/shared';

const BASE_URL = '/api/cloud-providers';

export const cloudProvidersApi = {
  testConnection: async (
    request: CloudProviderTestConnectionRequest,
  ): Promise<ApiResponse<CloudProviderTestConnectionResponse>> => {
    const res = await fetch(`${BASE_URL}/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return res.json();
  },

  create: async (
    input: CloudProviderCredentialInput,
  ): Promise<ApiResponse<CloudProviderCredential>> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return res.json();
  },

  getAll: async (): Promise<ApiResponse<CloudProviderCredential[]>> => {
    const res = await fetch(BASE_URL);
    return res.json();
  },

  getById: async (id: string): Promise<ApiResponse<CloudProviderCredential>> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  },

  discover: async (id: string): Promise<ApiResponse<CloudResourceDiscoveryResponse>> => {
    const res = await fetch(`${BASE_URL}/${id}/discover`);
    return res.json();
  },

  import: async (
    request: CloudResourceImportRequest,
  ): Promise<ApiResponse<CloudResourceImportResponse>> => {
    const res = await fetch(`${BASE_URL}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return res.json();
  },
};
