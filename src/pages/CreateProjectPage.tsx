import { CreateProjectForm } from '@/components/project/CreateProjectForm';
import { useNavigate } from 'react-router';

export const CreateProjectPage = () => {
  const navigate = useNavigate();
  const onSuccess = (projectId: String) => {
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
