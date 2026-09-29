import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/firebase/auth"; // 수정된 signInWithGoogle import
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [loading, setLoading] = useState(false);

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
      onOpenChange(false); // 로그인 성공 시 모달 닫기
    } catch (error) {
      console.error('리다이렉트 로그인 시작 실패:', error); // 에러 메시지 변경
      toast('로그인 시도 중 오류가 발생했습니다.'); // 사용자에게 표시되는 메시지 변경
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[26px] border-none bg-advent-cream p-6 shadow-[0_18px_34px_rgba(0,0,0,0.28)]">
        <DialogHeader>
          <span className="font-gowun text-[11px] font-bold tracking-[3px] text-advent-brick">
            LOGIN
          </span>
          <DialogTitle className="font-blackhan text-2xl text-advent-charcoal">
            로그인
          </DialogTitle>
          <DialogDescription className="font-gowun text-sm text-stone-600">
            Google 계정으로 로그인해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="font-gowun h-auto w-full gap-2 rounded-[14px] py-3.5 text-[15px] font-bold"
          >
            {loading ? (
              <>
                <Spinner />
                로그인 중...
              </>
            ) : (
              'Google로 계속하기'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
