import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { logout } from '@/firebase/auth';
import { useNavigate } from 'react-router';
import { LoginModal } from '../auth/LoginModal';
import { useState } from 'react';

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = async() => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('로그아웃 실패', error)
    }
  }

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
                  onClick={handleLogout} 
                  variant="ghost" 
                  className="text-sm font-medium"
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                variant="default"
                className="text-sm font-medium"
              >
                로그인
              </Button>
            )}
          </nav>
        </div>
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
      />
    </header>
  )
}
