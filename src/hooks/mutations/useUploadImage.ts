import { uploadImage } from "@/firebase/image";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadImage(
  { projectId, dayNumber }: { projectId: string; dayNumber: number },
  callbacks?: UseMutationCallback,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      userId,
      userName,
    }: {
      file: File;
      userId: string;
      userName: string;
    }) => uploadImage(projectId, dayNumber, file, userId, userName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.images.byDay(projectId, dayNumber),
      });
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
