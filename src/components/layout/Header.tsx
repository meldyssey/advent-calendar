import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { logout } from '@/firebase/auth';
import { useNavigate } from 'react-router';

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <button 
            onClick={() => navigate('/')}
            className="text-2xl font-yangju text-slate-900"
          >
            Advent Calendar
          </button>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  onClick={() => navigate('/projects')}
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
            ) : (
              <Button 
                onClick={() => navigate('/login')} 
                variant="default" 
                className="text-sm font-medium"
              >
                로그인
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
