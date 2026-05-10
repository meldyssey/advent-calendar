import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/auth/LoginForm";
import { Header } from "./components/layout/Header";
import { useLocation } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";
import { isKakaoTalkBrowser, openInExternalBrwoser } from "@/lib/browserDetect";
import GlobalLoader from "./components/GlobalLoader";
import RootRoute from "./RootRoute";

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 카카오톡 브라우저 체크
  useEffect(() => {
    if (isKakaoTalkBrowser()) {
      openInExternalBrwoser();
    }
  }, []);

  if (loading) {
    return <GlobalLoader />;
  }

  // 초대 링크 접근 시에만 로그인 필수
  const isInvitePath = location.pathname.startsWith("/join");

  if (!user && isInvitePath) {
    // 초대 링크는 로그인 후 리다이렉트를 위해 저장
    return <LoginForm returnUrl={location.pathname} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <RootRoute />
      </main>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
