import { createProject } from "@/firebase/projects";
import { useMutation } from "@tanstack/react-query";

type CreateProjectCallback = {
  onSuccess?: (projectId: string) => void;
  onError?: (error: Error) => void;
};

export function useCreateProject(callbacks?: CreateProjectCallback) {
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
