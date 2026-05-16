import { Navigate, Route, Routes, useLocation } from "react-router";
import { HomePage } from "./pages/HomePage";

import { lazy, Suspense, useEffect } from "react";
import { Spinner } from "./components/ui/spinner";
import { LoginForm } from "./components/auth/LoginForm";
import { isKakaoTalkBrowser, openInExternalBrwoser } from "./lib/browserDetect";
import { useAuth } from "./hooks/useAuth";
import GlobalLayout from "./components/layout/GlobalLayout";

const ProjectListPage = lazy(() =>
  import("./pages/ProjectListPage").then((m) => ({
    default: m.ProjectListPage,
  })),
);
const CreateProjectPage = lazy(() =>
  import("./pages/CreateProjectPage").then((m) => ({
    default: m.CreateProjectPage,
  })),
);
const ProjectDetailPage = lazy(() =>
  import("./pages/ProjectDetailPage").then((m) => ({
    default: m.ProjectDetailPage,
  })),
);
const JoinProjectPage = lazy(() =>
  import("./pages/JoinProjectPage").then((m) => ({
    default: m.JoinProjectPage,
  })),
);

export default function RootRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 카카오톡 브라우저 체크
  useEffect(() => {
    if (isKakaoTalkBrowser()) {
      openInExternalBrwoser();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-sm text-slate-600 mt-4">로딩 중...</p>
      </div>
    );
  }

  const isProjectPath = location.pathname.startsWith("/projects");
  if (!user && isProjectPath) {
    return <Navigate to="/" replace />;
  }

  // 초대 링크 접근 시에만 로그인 필수
  const isInvitePath = location.pathname.startsWith("/join");

  if (!user && isInvitePath) {
    return <LoginForm returnUrl={location.pathname} />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/join/:id" element={<JoinProjectPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
