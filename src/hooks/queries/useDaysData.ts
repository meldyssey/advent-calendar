import { getDays } from "@/firebase/days";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useDaysData({ projectId }: { projectId?: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.days.byId(projectId!),
    queryFn: () => getDays(projectId!),
    enabled: !!projectId,
  });
}
