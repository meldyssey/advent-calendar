import type { DayData } from '@/types';
import { useState } from 'react';
import { ImageUploadModal } from './ImageUploadModal';
import { ImageDetailModal } from './ImageDetailModal';
import { UploadCloud } from 'lucide-react';
import { useImagesData } from '@/hooks/queries/useImagesData';

interface DayCardProps {
  day: DayData;
  projectId: string;
  totalDays: number;
  memberCount: number; // 멤버 수 추가
}

export const DayCard = ({ day, projectId, totalDays, memberCount }: DayCardProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const { data: images = [], isPending: isImageDataPending } = useImagesData({projectId, dayNumber: day.dayNumber})

  // 날짜 상태 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayDate = new Date(day.date);
  dayDate.setHours(0, 0, 0, 0);
  
  const isPast = dayDate < today;
  const isToday = dayDate.getTime() === today.getTime();
  const isFuture = dayDate > today;
  const canUpload = isToday || isPast;


  // 카드 스타일
  const getCardStyle = () => {
    if (isToday) {
      return 'border-2 border-green-500 bg-green-50';
    }
    if (isPast) {
      return 'border border-slate-300 bg-white';
    }
    return 'border border-slate-200 bg-slate-50 opacity-60';
  };

  // D-Day 계산
  const getDayLabel = () => {
    if (day.dayNumber === totalDays) return 'D-Day';    
    return `D-${Number(totalDays) - day.dayNumber}`;
  };

  return (
    <>
      <div className={`rounded-lg p-4 transition-all hover:shadow-lg ${getCardStyle()}`}>
        {/* D-Day 라벨 */}
        <div className="text-center mb-2">
          <span className={`text-sm font-bold ${isToday ? 'text-green-600' : 'text-slate-600'}`}>
            {getDayLabel()}
          </span>
        </div>

        {/* 날짜 */}
        <div className="text-center mb-3">
          <div className="text-xs text-slate-500">
            {dayDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* 테마 */}
        <div className="bg-slate-100 rounded p-2 text-center min-h-[60px] flex items-center justify-center">
          <p className="text-sm text-slate-700 font-medium break-words">
            {day.theme}
          </p>
        </div>

        {/* 이미지 영역 - 멤버 수만큼 그리드 표시 */}
        <div className="my-3">
          {isImageDataPending ? (
            <div className="h-32 rounded flex items-center justify-center">
              <div className="text-sm text-slate-400">로딩 중...</div>
            </div>
          ) : (
            <div className={`grid gap-2 ${
              memberCount === 1 ? 'grid-cols-1 md:max-w-xs md:mx-auto' :
              memberCount === 2 ? 'grid-cols-2' :
              memberCount === 3 ? 'grid-cols-3' :
              memberCount === 4 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}>
              {Array.from({ length: memberCount }).map((_, index) => {
                const image = images[index];
                const hasImage = !!image;
                return (
                  <div key={index} className="aspect-square">
                    {hasImage ? (
                      // 이미지 있음: 썸네일 표시
                      <div className="w-full h-full flex flex-col">
                        <div
                          className="flex-1 relative rounded-t overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setIsDetailModalOpen(true)}
                        >
                          <img
                            src={image.imageUrl}
                            alt={`${image.userName}의 이미지`}
                            className="w-full h-full object-cover"
                          />
                          <div>{image.userName}</div>
                        </div>
                        <div className="text-xs text-center text-slate-600 py-1 bg-slate-50 rounded-b md:text-sm">
                          👤 {image.userName}
                        </div>
                      </div>
                    ) : (
                      // 이미지 없음: 업로드 UI 표시
                      <button
                        onClick={() => canUpload && setIsUploadModalOpen(true)}
                        disabled={!canUpload}
                        className={`w-full h-full border-2 border-dashed rounded flex flex-col items-center justify-center gap-1 transition-colors ${
                          canUpload
                            ? 'border-slate-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                            : 'border-slate-200 bg-slate-50 cursor-not-allowed'
                        }`}
                      >
                        {/* 클라우드 업로드 아이콘 */}
                        <UploadCloud/>
                        <span className={`text-[9px] ${canUpload ? 'text-slate-500' : 'text-slate-400'}`}>
                          업로드
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 상태 표시 */}
        <div className="mt-3 text-center">
          {isFuture && (
            <div className="text-xs text-slate-400">
              🔒 잠김
            </div>
          )}
          {isToday && (
            <div className="text-xs text-green-600 font-semibold">
              📷 업로드 가능
            </div>
          )}
        </div>
      </div>
      {/* 업로드 모달 */}
      {isUploadModalOpen && (
        <ImageUploadModal
          projectId={projectId}
          dayNumber={day.dayNumber}
          dayTheme={day.theme}
          totalDays={totalDays}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}
      {/* 상세 모달 - 추가 */}
      {isDetailModalOpen && images.length > 0 && (
        <ImageDetailModal
          images={images}
          initialIndex={0}
          dayTheme={day.theme}
          dayNumber={day.dayNumber}
          projectId={projectId}
          totalDays={totalDays}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </>
  );
};