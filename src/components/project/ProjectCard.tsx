import type { ProjectData } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router';

// 프로젝트 카드 컴포넌트
interface ProjectCardProps {
  project: ProjectData;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate()
  // 날짜 포맷
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // D-Day 계산
  const getDaysRemaining = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(project.startDate);
    start.setHours(0, 0, 0, 0)
    const end = new Date(project.endDate);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (today < start) return '시작예정'; 
    if (diffDays < 0) return '종료됨';
    if (diffDays === 0) return 'D-Day!';
    return `D-${diffDays}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-100">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <span className="text-sm font-bold text-blue-600">
            {getDaysRemaining()}
          </span>
        </div>
        <CardDescription>
          {formatDate(project.startDate)} - {formatDate(project.endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 정보 */}
        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{project.totalDays}일 프로젝트</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>{project.members.length}명 참여 중</span>
          </div>
        </div>

        {/* 버튼 */}
        <Button
          onClick={() => navigate(`/projects/${project.id}`)}
          className="w-full"
        >
          프로젝트 보기
        </Button>
      </CardContent>
    </Card>
  );
};
