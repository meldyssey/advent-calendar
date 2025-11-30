import type { DayData } from '@/types';

interface DayCardProps {
  day: DayData;
  projectId: string;
  totalDays: number;
}

export const DayCard = ({ day, totalDays }: DayCardProps) => {
  // 날짜 상태 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayDate = new Date(day.date);
  dayDate.setHours(0, 0, 0, 0);
  
  const isPast = dayDate < today;
  const isToday = dayDate.getTime() === today.getTime();
  const isFuture = dayDate > today;

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
  );
};