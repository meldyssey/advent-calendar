import { CalendarGrid } from '@/components/project/CalendarGrid';
import { InviteModal } from '@/components/project/InviteModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getDays } from '@/firebase/days';
import { deleteProject, getProject } from '@/firebase/projects';
import { useAuth } from '@/hooks/useAuth';
import type { DayData, ProjectData } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectData>()
  const [days, setDays] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const [projectData, daysData] = await Promise.all([
          getProject(id),
          getDays(id),
        ])
        
        if (!projectData) {
          setError('프로젝트를 찾을 수 없습니다.');
          return;
        }

        if (!daysData) {
          setError('프로젝트 주제를 찾을 수 없습니다.');
          return;
        }

        setProject(projectData)
        setDays(daysData)
      } catch (error) {
        console.error('프로젝트 로딩 실패', error)
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id])
  
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-sm text-slate-600 mt-4">프로젝트를 불러오는 중...</p>
      </div>      
    )
  }

  // 에러
  if (error || !project || !days) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-4">
            {error || '프로젝트를 찾을 수 없습니다.'}
          </div>
          <Button onClick={() => navigate('/projects')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const isCreator = user?.uid === project?.createdBy

  // D-Day 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(project.endDate);
  endDate.setHours(0, 0, 0, 0);
  const dDay = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const hadleDeleteProject = async(projectId:string) => {

    try {
      await deleteProject(projectId)
      toast('프로젝트가 삭제되었습니다.')
      navigate(`/projects`)
    } catch (error) {
      console.error('프로젝트 삭제 실패: ', error);
      toast('프로젝트 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/projects')}
            variant="ghost"
            className="mb-4"
          >
            ← 목록으로
          </Button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {project.title}
            </h1>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:items-center text-slate-600">
              <span>
                📅 {new Date(project.startDate).toLocaleDateString('ko-KR')} - {new Date(project.endDate).toLocaleDateString('ko-KR')}
              </span>
              <span className="text-lg font-semibold text-blue-600">
                {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day' : '종료'}
              </span>
              <span>
                👥 {project.members.length}명
              </span>
              {/* 초대 버튼 (생성자만) - 추가 */}
              {isCreator && (
                <div className="flex md:ml-auto gap-4">
                  <Button
                    onClick={() => setIsInviteModalOpen(true)}
                    className='flex-1'
                  >
                    👥 친구 초대
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {/* <Button
                        className="flex-1"
                        variant="secondary"
                      >
                        프로젝트 삭제
                      </Button> */}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>정말 프로젝트를 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          이 작업은 되돌릴 수 없습니다. 프로젝트의 모든 데이터가 완전히 삭제됩니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => id && hadleDeleteProject(id)}
                        >
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* 캘린더 그리드 */}
        <CalendarGrid
          days={days}
          projectId={id!}
          totalDays={project.totalDays}
          memberCount={project.members.length}
        />
      </div>
      {/* 초대 모달 - 추가 */}
      {isInviteModalOpen && (
        <InviteModal
          projectId={id!}
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}
    </div>
  )
}
