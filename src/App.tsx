import { useAuth } from "./hooks/useAuth";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import { LoginForm } from "./components/auth/LoginForm";
import { HomePage } from './pages/HomePage';
import { Header } from "./components/layout/Header";
import { ProjectListPage } from "./pages/ProjectListPage";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { CreateProjectPage } from "./pages/CreateProjectPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { JoinProjectPage } from "./pages/JoinProjectPage";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-sm text-slate-600 mt-4">로딩 중...</p>
      </div>
    )
  }

  // 초대 링크 접근 시에만 로그인 필수
  const isInvitePath = location.pathname.startsWith('/join');

  if (!user && isInvitePath) {
    // 초대 링크는 로그인 후 리다이렉트를 위해 저장
    return <LoginForm returnUrl={location.pathname} />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/projects" element={<ProjectListPage/>}/>
          <Route path="/projects/:id" element={<ProjectDetailPage/>}/>
          <Route path="/projects/new" element={<CreateProjectPage/>}/>
          <Route path="/join/:id" element={<JoinProjectPage/>}/>
          <Route path="*" element={<Navigate to="/" replace />}/>
        </Routes>
      </main>
    </div>
  );
}

export default App;