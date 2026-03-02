import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api";

export function useSystemInfo(connectionId: string) {
  return useQuery({
    queryKey: ["system-info", connectionId],
    queryFn: () => statsApi.getSystemInfo(connectionId),
    staleTime: Infinity,
  });
}
