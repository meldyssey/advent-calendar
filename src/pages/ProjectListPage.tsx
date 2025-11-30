import { ProjectList } from '@/components/project/ProjectList';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';


export const ProjectListPage = () => {
  const navigate = useNavigate()
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              내 프로젝트
            </h1>
            <p className="text-slate-600">
              참여 중인 어드벤트 캘린더 프로젝트 목록
            </p>
          </div>
          <Button size="lg" onClick={()=>navigate('/projects/new')}>
            + 새 프로젝트
          </Button>
        </div>

        {/* 프로젝트 목록 */}
        <ProjectList />
      </div>
    </div>
  );
};