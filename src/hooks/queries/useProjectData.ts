import { getProject } from "@/firebase/projects";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useProjectData({ projectId }: { projectId?: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.project.byId(projectId!),
    queryFn: async () => {
      const data = await getProject(projectId!)
      if (!data) throw new Error("프로젝트를 찾을 수 없습니다.")
      return data;
    },
    enabled: !!projectId,
  });
}
