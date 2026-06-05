import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import type { ImageData } from '@/types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteImage } from '@/hooks/mutations/useDeleteImage';

interface ImageDetailModalProps {
  images: ImageData[];
  initialIndex?: number;
  dayTheme: string;
  dayNumber: number;
  projectId: string;
  totalDays: number;
  onClose: () => void;
}

export const ImageDetailModal = ({
  images,
  initialIndex = 0,
  dayTheme,
  dayNumber,
  projectId,
  totalDays,
  onClose,
}: ImageDetailModalProps) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentImage = images[currentIndex];
  const isOwner = user?.uid === currentImage.userId;

  const { mutate: deleteImage, isPending: isDeleteImagePending } = useDeleteImage({ projectId, dayNumber }, {
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        toast('이미지 삭제에 실패했습니다.');
      },
  })

  // 이전 이미지
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  // 다음 이미지
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // 이미지 삭제
  const handleDelete = async () => {
    if (!isOwner) {
      toast('자신이 올린 이미지만 삭제할 수 있습니다.');
      return;
    }

    if (!confirm('이미지를 삭제하시겠습니까?')) {
      return;
    }

    deleteImage({ imageId: currentImage.id, storagePath: currentImage.storagePath})
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8"
      onClick={onClose}
      tabIndex={0}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>
        {/* 이미지 */}
        <div className="bg-white rounded-lg overflow-hidden flex flex-col max-h-full">
          <div className='m-2 text-lg'>
            <h1 className="text-center font-bold text-slate-900 mb-1">
              D-{totalDays - dayNumber}: {dayTheme}
            </h1>
          </div>     
          <div className="relative flex-shrink-0 h-[60vh] bg-slate-100 flex items-center justify-center">
            <img
              src={currentImage.imageUrl}
              alt={`Day ${dayNumber} - ${dayTheme}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* 이전/다음 버튼 (이미지가 여러 개일 때만) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />

                </button>
              </>
            )}

            {/* 이미지 카운터 */}
            {images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* 이미지 정보 */}
          <div className="p-4 border-t overflow-y-auto flex-shrink">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="space-y-1 text-xs text-slate-600">
                  <p>
                    👤 {currentImage.userName}
                  </p>
                  <p>
                    📅 {currentImage.uploadedAt.toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* 삭제 버튼 (본인만) */}
              {isOwner && (
                <Button
                  onClick={handleDelete}
                  disabled={isDeleteImagePending}
                  variant="destructive"
                  size="sm"
                  className="flex-shrink-0"
                >
                  {isDeleteImagePending ? '삭제 중...' : '🗑️ 삭제'}
                </Button>
              )}
            </div>

            {/* 썸네일 리스트 (이미지가 여러 개일 때) */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-blue-500 scale-105'
                        : 'border-slate-300 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};