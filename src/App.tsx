import { useAuth } from "./hooks/useAuth";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import { LoginForm } from "./components/auth/LoginForm";
import { HomePage } from './pages/HomePage';
import { Header } from "./components/layout/Header";
import { useState } from "react";
import { ProjectListPage } from "./pages/ProjectListPage";
import { Navigate, Route, Routes } from "react-router";
import { CreateProjectPage } from "./pages/CreateProjectPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";

type Page = 'home' | 'projects' | 'create';

function App() {
  const { user, loading } = useAuth();

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

  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/projects" element={<ProjectListPage/>}/>
        <Route path="/projects/:id" element={<ProjectDetailPage/>}/>
        <Route path="/projects/new" element={<CreateProjectPage/>}/>
        <Route path="*" element={<Navigate to="/" replace />}/>
      </Routes>
    </div>
  );
}

export default App;