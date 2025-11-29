import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signInWithGoogle } from "@/firebase/auth";

export const LoginForm = () => {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // signInWithGoogle 함수를 한 번만 호출합니다.
      await signInWithGoogle();
      // 로그인 성공 후의 로직은 onAuthStateChanged가 처리하므로 여기서는 특별한 작업이 필요 없습니다.
    } catch (error){
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            구글게정으로 로그인해주세요.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? '로그인 중...' : 'Login with Google'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
