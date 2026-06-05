import { deleteImage } from "@/firebase/image";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteImage(
  { projectId, dayNumber }: { projectId: string; dayNumber: number },
  callbacks?: UseMutationCallback,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      imageId,
      storagePath,
    }: {
      imageId: string;
      storagePath: string;
    }) => deleteImage(projectId, imageId, storagePath),
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
