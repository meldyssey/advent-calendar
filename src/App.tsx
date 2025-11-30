import { useAuth } from "./hooks/useAuth";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import { LoginForm } from "./components/auth/LoginForm";
import { HomePage } from './pages/HomePage';
import { Header } from "./components/layout/Header";
import { useState } from "react";
import { ProjectListPage } from "./pages/ProjectListPage";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { CreateProjectPage } from "./pages/CreateProjectPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { JoinProjectPage } from "./pages/JoinProjectPage";

type Page = 'home' | 'projects' | 'create';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Button variant="outline" disabled size="sm">
          <Spinner />
            로딩 중...
        </Button>
      </div>
    )
  }

  // 로그인하지 않은 경우
  if (!user) {
    // /join 경로는 로그인 후 리다이렉트를 위해 저장
    if (location.pathname.startsWith('/join')) {
      // 로그인 페이지에 returnUrl 전달
      return <LoginForm returnUrl={location.pathname} />;
    }
    
    return <LoginForm />;
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/projects" element={<ProjectListPage/>}/>
        <Route path="/projects/:id" element={<ProjectDetailPage/>}/>
        <Route path="/projects/new" element={<CreateProjectPage/>}/>
        <Route path="/join/:id" element={<JoinProjectPage/>}/>
        <Route path="*" element={<Navigate to="/" replace />}/>
      </Routes>
    </div>
  );
}

export default App;