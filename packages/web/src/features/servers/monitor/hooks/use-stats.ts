import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api";

export function useStats(connectionId: string) {
  return useQuery({
    queryKey: ["stats", connectionId],
    queryFn: () => statsApi.get(connectionId),
    refetchInterval: 10000,
  });
}
