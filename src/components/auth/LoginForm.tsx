import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/firebase/auth";
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface LoginFormProps {
  returnUrl?: string;
}

export const LoginForm = ({returnUrl}: LoginFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(user) {
      navigate(returnUrl || '/');
    }
  }, [user, returnUrl, navigate])

  // pageshow 이벤트 추가 (뒤로가기 로딩 버그 수정)
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setLoading(false);
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error){
      console.error('로그인 실패:', error);
      toast('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-advent-green p-4">
      <div className="w-full max-w-sm rounded-[26px] bg-advent-cream p-6 shadow-[0_18px_34px_rgba(0,0,0,0.28)]">
        <span className="font-gowun text-[11px] font-bold tracking-[3px] text-advent-brick">
          INVITE
        </span>
        <h1 className="font-blackhan mt-1 text-2xl text-advent-charcoal">
          초대장이 도착했어요
        </h1>
        <p className="font-gowun mt-2 text-sm text-stone-600">
          Google 계정으로 로그인하고 함께 추억을 만들어보세요.
        </p>
        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="font-gowun mt-5 h-auto w-full gap-2 rounded-[14px] py-3.5 text-[15px] font-bold"
        >
          {loading ? (<><Spinner/>로그인 중...</>) : <>
              Google로 계속하기
            </>}
        </Button>
      </div>
    </div>
  )
}
