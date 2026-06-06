import { createProject } from "@/firebase/projects";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateProject(
  { userId }: { userId: string },
  callbacks?: UseMutationCallback<string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.list(userId),
      });
      if (callbacks?.onSuccess) callbacks.onSuccess(projectId);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
