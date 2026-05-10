import GlobalLoader from "@/components/GlobalLoader";
import { Button } from "@/components/ui/button";
import { addMember, getProject } from "@/firebase/projects";
import { useAuth } from "@/hooks/useAuth";
import type { ProjectData } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";


export const JoinProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyMember, setAlreadyMember] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        const projectData = await getProject(id);

        if (!projectData) {
          setError('프로젝트를 찾을 수 없습니다.');
          return;
        }

        setProject(projectData);

        // 이미 멤버인지 확인
        if (projectData.members.includes(user.uid)) {
          setAlreadyMember(true);
        }
      } catch (err) {
        console.error('프로젝트 로딩 실패:', err);
        setError('프로젝트를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, user]);

  const handleJoin = async () => {
    if (!id || !user || !project) return;

    try {
      setJoining(true);
      await addMember(id, user.uid);
      
      // 성공 후 프로젝트 페이지로 이동
      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('참여 실패:', error);
      if (error instanceof Error && error.message.includes('이미 프로젝트 멤버')) {
        setAlreadyMember(true);
      } else {
        alert('프로젝트 참여에 실패했습니다.');
      }
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <GlobalLoader/>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            프로젝트를 찾을 수 없습니다
          </h2>
          <p className="text-slate-600 mb-6">
            {error || '유효하지 않은 초대 링크입니다.'}
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
          <Button onClick={() => navigate(`/projects/${id}`)}>
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
                📅 {new Date(project.startDate).toLocaleDateString('ko-KR')} - {new Date(project.endDate).toLocaleDateString('ko-KR')}
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
              onClick={() => navigate('/projects')}
              variant="outline"
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleJoin}
              disabled={joining}
              className="flex-1"
            >
              {joining ? '참여 중...' : '참여하기'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

