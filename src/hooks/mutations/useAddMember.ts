import { addMember } from "@/firebase/projects";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddMember(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      addMember({ projectId, userId }),
    onSuccess: async (_data, { projectId, userId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.byId(projectId) }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.list(userId) }),
      ])
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}
