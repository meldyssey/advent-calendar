import { CreateProjectForm } from '@/components/project/CreateProjectForm';
import { useNavigate } from 'react-router';

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const onSuccess = (projectId: string) => {
    navigate(`/projects/${projectId}`)
  }
  return (
    <div>
      <CreateProjectForm
        onSuccess={onSuccess}
      />
    </div>
  )
}
