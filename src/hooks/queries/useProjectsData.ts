import { getMyProjects } from "@/firebase/projects";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useProjectsData({ userId }: { userId: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.project.list(userId),
    queryFn: () => getMyProjects(userId),
    enabled: !!userId,
  });
}
