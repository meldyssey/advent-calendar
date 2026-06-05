import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useAddMember } from "@/hooks/mutations/useAddMember";
import { useProjectData } from "@/hooks/queries/useProjectData";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";


export const JoinProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: project, error: projectDataError, isPending: isProjectDataPending } = useProjectData({projectId})

  const { mutate: addMember, isPending: isAddMemberPending } = useAddMember({
    onSuccess: () => {
      navigate(`/projects/${projectId}`);
    },
    onError: () => {
      toast.error("프로젝트 참여에 실패했습니다", {
        position: "top-center",
      });
    },
  });

  const alreadyMember = project?.members.includes(user?.uid ?? '') ?? false

  const handleJoin = () => {
    if (!projectId || !user || !project) return;
    addMember({ projectId, userId: user.uid })
  };

  if (isProjectDataPending) return <Loader />

  if (projectDataError || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            프로젝트를 찾을 수 없습니다
          </h2>
          <p className="text-slate-600 mb-6">
            { '유효하지 않은 초대 링크입니다.'}
          </p>
          <Button onClick={() => navigate('/projects')}>
            내 프로젝트로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (alreadyMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            이미 참여 중입니다
          </h2>
          <p className="text-slate-600 mb-6">
            {project.title} 프로젝트의 멤버입니다.
          </p>
          <Button onClick={() => navigate(`/projects/${projectId}`)}>
            프로젝트 보기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <meta name="description" content="초대 링크로 어드벤트 캘린더에 참여하세요" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          {/* 초대 헤더 */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎄</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              프로젝트 초대
            </h2>
            <p className="text-slate-600">
              프로젝트에 참여하시겠습니까?
            </p>
          </div>

          {/* 프로젝트 정보 */}
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {project.title}
            </h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                📅 {project.startDate.toLocaleDateString('ko-KR')} - {project.endDate.toLocaleDateString('ko-KR')}
              </p>
              <p>
                📆 총 {project.totalDays}일
              </p>
              <p>
                👥 {project.members.length}명 참여 중
              </p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Button
              disabled= {isAddMemberPending}
              onClick={() => navigate('/projects')}
              variant="outline"
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleJoin}
              disabled={isAddMemberPending}
              className="flex-1"
            >
              {isAddMemberPending ? '참여 중...' : '참여하기'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

