import Loader from '@/components/Loader';
import { CalendarGrid } from '@/components/project/CalendarGrid';
import { InviteModal } from '@/components/project/InviteModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteProject } from '@/hooks/mutations/useDeleteProject';
import { useDaysData } from '@/hooks/queries/useDaysData';
import { useProjectData } from '@/hooks/queries/useProjectData';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: project, error: projectDataError, isPending: isProjectDataPending } = useProjectData({projectId})
  const { data: days, error: daysDataError, isPending: isDaysDataPending } = useDaysData({projectId})

  const { mutate: deleteProject, isPending: isDeleteProjectPending } = useDeleteProject(
    { userId: user!.uid },
    { 
      onSuccess: () => {
        toast('프로젝트가 삭제되었습니다.');
        navigate('/projects')
      },
      onError: () => {
        toast('프로젝트 삭제에 실패했습니다.')
      }
    }
  )

  if (isProjectDataPending || isDaysDataPending) return <Loader/>

  if (projectDataError || daysDataError || !project || !days) {
        return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-4">
            {'프로젝트를 찾을 수 없습니다.'}
          </div>
          <Button onClick={() => navigate('/projects')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  };

  const isCreator = user?.uid === project.createdBy

  // D-Day 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(project.endDate);
  endDate.setHours(0, 0, 0, 0);
  const dDay = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleDeleteProject = (projectId:string) => {
    deleteProject(projectId)
  }

  return (
    <>
      <meta name="description" content={`${project.title} — 날짜별 사진을 공유하는 어드벤트 캘린더`} />
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
                      disabled={isDeleteProjectPending}
                    >
                      👥 친구 초대
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="flex-1"
                          variant="secondary"
                          disabled={isDeleteProjectPending}
                        >
                          {isDeleteProjectPending ? '삭제 중...' : '프로젝트 삭제'}
                        </Button>
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
                            onClick={() => projectId && handleDeleteProject(projectId)}
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
            projectId={projectId!}
            totalDays={project.totalDays}
            memberCount={project.members.length}
          />
        </div>
        {/* 초대 모달 - 추가 */}
        {isInviteModalOpen && (
          <InviteModal
            projectId={projectId!}
            onClose={() => setIsInviteModalOpen(false)}
          />
        )}
      </div>
    </>
  )
}
