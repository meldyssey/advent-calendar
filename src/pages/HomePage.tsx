import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { LoginModal } from '@/components/auth/LoginModal';
import { AdventHero } from '@/components/home/AdventHero';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { PlusCircle, FolderOpen } from 'lucide-react';

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <meta name="description" content="친구들과 날짜별 테마에 맞춰 사진을 공유하는 어드벤트 캘린더" />
      <div className="flex-1 bg-advent-green">
        <div className="mx-auto flex max-w-xl flex-col gap-6 px-6 py-12 sm:py-16">
          <AdventHero />

          {/* CTA 카드 */}
          <div className="flex flex-col gap-3.5 rounded-[26px] bg-advent-cream p-6 shadow-[0_18px_34px_rgba(0,0,0,0.28)]">
            <span className="font-gowun text-[11px] font-bold tracking-[3px] text-advent-brick">START</span>
            <p className="font-blackhan text-xl text-advent-charcoal">시작하기</p>

            {user ? (
              <>
                <p className="font-gowun text-sm leading-relaxed text-stone-600">
                  새로운 프로젝트를 만들거나 기존 프로젝트를 확인하세요
                </p>
                <div className="mt-1 flex flex-col gap-2.5">
                  <Button
                    onClick={() => navigate('/projects/new')}
                    className="font-gowun h-auto w-full gap-2 rounded-[14px] py-3.5 text-[15px] font-bold"
                  >
                    <PlusCircle className="h-[18px] w-[18px]" />
                    새 프로젝트 만들기
                  </Button>
                  <Button
                    onClick={() => navigate('/projects')}
                    variant="outline"
                    className="font-gowun h-auto w-full gap-2 rounded-[14px] border-[1.6px] border-advent-sage bg-transparent py-3 text-[15px] font-bold text-advent-charcoal"
                  >
                    <FolderOpen className="h-[18px] w-[18px]" />
                    내 프로젝트 보기
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="font-gowun text-sm leading-relaxed text-stone-600">
                  프로젝트를 시작하기 위해 로그인해주세요.
                </p>
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="font-gowun h-auto w-full gap-2 rounded-[14px] py-3.5 text-[15px] font-bold"
                >
                  로그인하기
                </Button>
              </>
            )}
          </div>

          {/* 하단 라벨 */}
          <div className="flex items-center justify-center gap-2.5">
            <div className="h-px w-6 bg-advent-cream/35" />
            <span className="font-gowun text-[10px] tracking-[3px] text-advent-cream/55">
              MAKE MEMORIES TOGETHER
            </span>
            <div className="h-px w-6 bg-advent-cream/35" />
          </div>
        </div>

        {/* 로그인 모달 */}
        <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
      </div>
    </>
  );
};
