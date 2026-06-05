import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { getDayImages } from "@/firebase/image";

export function useImagesData({
  projectId,
  dayNumber,
}: {
  projectId: string;
  dayNumber: number;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.images.byDay(projectId, dayNumber),
    queryFn: () => getDayImages(projectId, dayNumber),
  });
}
