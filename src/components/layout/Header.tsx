import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { logout } from '@/firebase/auth';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <h1 className="text-2xl font-yangju text-slate-900">
            Advent Calendar
          </h1>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-4">
            {user && (
              <>
                <Button
                  variant="ghost"
                  className="text-sm font-medium"
                >
                  📂 내 프로젝트
                </Button>
                <Button 
                  onClick={logout} 
                  variant="ghost" 
                  className="text-sm font-medium"
                >
                  로그아웃
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
