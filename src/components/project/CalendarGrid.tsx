import type { DayData } from '@/types';
import { DayCard } from './DayCard';

interface CalendarGridProps {
  days: DayData[];
  projectId: string;
  totalDays: number;
  memberCount: number;
}

export const CalendarGrid = ({ days, projectId, totalDays, memberCount }: CalendarGridProps) => {
  if (days.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-slate-500">날짜 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {days.map((day) => (
        <DayCard
          key={day.id}
          day={day}
          projectId={projectId}
          totalDays={totalDays}
          memberCount={memberCount}
        />
      ))}
    </div>
  );
};