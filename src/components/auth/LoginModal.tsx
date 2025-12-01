import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signInWithGoogle } from "@/firebase/auth"; // 수정된 signInWithGoogle import
import { Spinner } from "../ui/spinner";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onOpenChange(false); // 로그인 성공 시 모달 닫기
    } catch (error) {
      console.error('리다이렉트 로그인 시작 실패:', error); // 에러 메시지 변경
      alert('로그인 시도 중 오류가 발생했습니다.'); // 사용자에게 표시되는 메시지 변경
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>
            Google 계정으로 로그인해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                로그인 중...
              </>
            ) : (
              <>
                Google로 계속하기
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
