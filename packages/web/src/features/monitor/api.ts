import type { ServerStats } from "@stacklane/shared";
import { request } from "@/lib/api";

export const statsApi = {
  get: (connectionId: string) =>
    request<ServerStats>(`/stats/${connectionId}`),
};
