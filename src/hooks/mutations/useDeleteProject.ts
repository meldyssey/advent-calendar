import { deleteProjectImages } from "@/firebase/image";
import { deleteProject } from "@/firebase/projects";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteProject(
  { userId }: { userId: string },
  callbacks?: UseMutationCallback,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      await deleteProjectImages(projectId);
      await deleteProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.list(userId),
      });
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
