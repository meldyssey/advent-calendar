import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { Navigate } from 'react-router';

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* 로고 + 환영메시지 */}
        <img 
          src="/images/logo.png" 
          alt="Logo" 
          className="h-64 mx-auto"
        />
        <div className="text-center mb-12">
          <h2 className="text-5xl font-yangju text-slate-900 m-4">
            함께 만드는 특별한 추억
          </h2>
          <p className="font-yangju text-xl text-slate-600">
            어드벤트 캘린더로 소중한 순간을 기록하세요
          </p>
        </div>

        {/* 시작하기 카드 */}
        <Card className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎁</div>
            <CardTitle className="text-2xl">시작하기</CardTitle>
            <CardDescription>
              새로운 프로젝트를 만들거나 기존 프로젝트를 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={()=>navigate('/projects/new')}
              className="w-full" 
              size="lg"
            >
              📝 새 프로젝트 만들기
            </Button>
            <Button 
              onClick={() => navigate('/projects')}
              className="w-full" 
              variant="outline" 
              size="lg">
              📂 내 프로젝트 보기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
