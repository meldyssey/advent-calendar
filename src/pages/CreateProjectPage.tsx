import { CreateProjectForm } from '@/components/project/CreateProjectForm';
import { useNavigate } from 'react-router';

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const onSuccess = (projectId: string) => {
    navigate(`/projects/${projectId}`)
  }
  return (
    <>
      <meta name="description" content="새로운 어드벤트 캘린더를 만들어 친구들과 추억을 쌓아보세요" />
      <div>
        <CreateProjectForm
          onSuccess={onSuccess}
        />
      </div>
    </>
  )
}
