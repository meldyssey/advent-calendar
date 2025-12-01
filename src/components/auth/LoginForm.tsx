import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signInWithGoogle } from "@/firebase/auth";
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

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
  }, [user, returnUrl])

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
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
            구글계정으로 로그인해주세요.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (<><Spinner/>로그인 중...</>) : 'Login with Google'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
