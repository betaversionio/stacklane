import { request } from "@/lib/api";

interface TunnelResult {
  id: string;
  localPort: number;
}

export const tunnelApi = {
  create: (connectionId: string, remoteHost: string, remotePort: number) =>
    request<TunnelResult>(`/tunnel/${connectionId}`, {
      method: "POST",
      body: JSON.stringify({ remoteHost, remotePort }),
    }),
};
