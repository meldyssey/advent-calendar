import { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getGoogleRedirectResult } from '@/firebase/auth'; // import 경로 수정
import { createOrUpdateUser } from '@/firebase/user';
import { auth } from '@/firebase/config';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isMounted = useRef(true); // 컴포넌트 마운트 상태 추적
  const hasCheckedRedirectRef = useRef(false); // 리다이렉트 체크 여부 추적 (ref 사용)

  useEffect(() => {
    isMounted.current = true; // 컴포넌트 마운트 시 true로 설정

    const checkRedirectAndListen = async () => {
      // 리다이렉트 결과는 세션당 한 번만 확인
      if (!hasCheckedRedirectRef.current && sessionStorage.getItem('firebase_redirect_checked') !== 'true') {
        hasCheckedRedirectRef.current = true; // 체크 시작
        try {
          const redirectUser = await getGoogleRedirectResult();
          if (redirectUser) {
            console.log('리다이렉트 로그인 성공 (useAuth):', redirectUser);
            if (isMounted.current) { // 컴포넌트가 마운트된 상태에서만 상태 업데이트
              await createOrUpdateUser(
                redirectUser.uid,
                redirectUser.email,
                redirectUser.displayName || undefined,
                redirectUser.photoURL || undefined
              ).catch(error => {
                console.error('리다이렉트 후 사용자 정보 동기화 실패', error);
              });
              setUser(redirectUser);
              setLoading(false);
            }
          }
        } catch (error) {
          console.error('리다이렉트 로그인 결과 처리 실패 (useAuth):', error);
        } finally {
          sessionStorage.setItem('firebase_redirect_checked', 'true'); // 세션당 한 번 체크했음을 표시
        }
      }

      // onAuthStateChanged 리스너는 항상 설정
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (!isMounted.current) return; // 컴포넌트가 언마운트되면 상태 업데이트 방지

        if (currentUser) {
          // 기존 user와 다를 경우에만 createOrUpdateUser 실행 (중복 방지)
          if (!user || user.uid !== currentUser.uid) {
            await createOrUpdateUser(
              currentUser.uid,
              currentUser.email,
              currentUser.displayName || undefined,
              currentUser.photoURL || undefined
            ).catch(error => {
              console.error('사용자 정보 동기화 실패 (onAuthStateChanged):', error);
            });
          }
        }
        setUser(currentUser);
        setLoading(false);
      });

      return () => {
        unsubscribe(); // 리스너 정리
        isMounted.current = false; // 언마운트 시 플래그 설정
      };
    };

    checkRedirectAndListen();

    return () => {
      isMounted.current = false; // 초기 마운트 중 언마운트될 경우 대비
    };
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  return { user, loading };
};
