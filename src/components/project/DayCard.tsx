import { getDayImages } from '@/firebase/image';
import type { ImageData, DayData } from '@/types';
import { useEffect, useState } from 'react';
import { ImageUploadModal } from './ImageUploadModal';
import { ImageDetailModal } from './ImageDetailModal';

interface DayCardProps {
  day: DayData;
  projectId: string;
  totalDays: number;
}

export const DayCard = ({ day, projectId, totalDays }: DayCardProps) => {
  const [images, setImages] = useState<ImageData[]>([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [loading, setLoading] = useState(true);

  // 날짜 상태 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayDate = new Date(day.date);
  dayDate.setHours(0, 0, 0, 0);
  
  const isPast = dayDate < today;
  const isToday = dayDate.getTime() === today.getTime();
  const isFuture = dayDate > today;
  const canUpload = isToday || isPast;

  useEffect(()=>{
    const loadImages = async () => {
      try {
        setLoading(true);
        const data = await getDayImages(projectId, day.dayNumber);
        setImages(data)
      } catch (error) {
        console.error('이미지 로딩 실패',  error);
      } finally {
        setLoading(false);
      }
    }
    loadImages();
  }, [projectId, day.dayNumber])

  // 업로드 성공 시 이미지 새로고침
  const handleUploadSuccess = async () => {
    const data = await getDayImages(projectId, day.dayNumber);
    setImages(data);
  };

  // 삭제 성공 시 이미지 새로고침
  const handleDeleteSuccess = async () => {
    const data = await getDayImages(projectId, day.dayNumber);
    setImages(data);
  };

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

        {/* 이미지 영역 */}
        <div className="my-3">
          {loading ? (
            <div className="h-32 rounded flex items-center justify-center">
              <div className="text-xs text-slate-400">로딩 중...</div>
            </div>
          ) : images.length > 0 ? (
            // 이미지 있음: 썸네일 표시
            <div className="relative">
              <img
                src={images[0].imageUrl}
                alt={`Day ${day.dayNumber}`}
                className="w-full object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  setIsDetailModalOpen(true)
                }}
              />
              {images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  +{images.length - 1}
                </div>
              )}
            </div>
          ) : (
            // 이미지 없음: 업로드 UI 표시
            <button
              onClick={() => canUpload && setIsUploadModalOpen(true)}
              disabled={!canUpload}
              className={`w-full h-32 border-2 border-dashed rounded flex flex-col items-center justify-center gap-2 transition-colors ${
                canUpload
                  ? 'border-slate-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                  : 'border-slate-200 bg-slate-50 cursor-not-allowed'
              }`}
            >
              {/* 클라우드 업로드 아이콘 */}
              <svg
                className={`w-8 h-8 ${canUpload ? 'text-slate-400' : 'text-slate-300'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className={`text-xs ${canUpload ? 'text-slate-500' : 'text-slate-400'}`}>
                이미지 업로드
              </span>
            </button>
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
          {isPast && (
            <div className="text-xs text-slate-400">
              이미지 없음
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
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
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
          onDelete={handleDeleteSuccess}
        />
      )}
    </>
  );
};