import { useAuth } from "./hooks/useAuth";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import { LoginForm } from "./components/auth/LoginForm";
import { HomePage } from './pages/HomePage';
import { Header } from "./components/layout/Header";
import { ProjectList } from "./components/project/ProjectList";
import { CreateProjectForm } from "./components/project/CreateProjectForm";


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Button variant="outline" disabled size="sm">
          <Spinner />
            Please wait
        </Button>
      </div>
    )
  }

  if (!user){
    return <LoginForm />
  }

  return (
    <div className="min-h-screen">
      <Header />
      {/* <HomePage /> */}
      {/* <ProjectList /> */}
      <div className="py-12">
        <CreateProjectForm 
          onSuccess={(projectId) => {
            console.log('✅ 프로젝트 생성 완료:', projectId);
            alert(`프로젝트 생성 완료! ID: ${projectId}`);
          }}
          onCancel={() => {
            console.log('취소 클릭');
          }}
        />
      </div>
    </div>
  )
}

export default App;