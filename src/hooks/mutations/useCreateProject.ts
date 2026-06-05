import { createProject } from "@/firebase/projects";
import type { UseMutationCallback } from "@/types";
import { useMutation } from "@tanstack/react-query";


export function useCreateProject(callbacks?: UseMutationCallback<string>) {
  return useMutation({
    mutationFn: createProject,
    onSuccess: (projectId) => {
      if (callbacks?.onSuccess) callbacks.onSuccess(projectId);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
