import { auth } from "./config";
import {
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup, // Import signInWithPopup
  type User,
} from "firebase/auth";

export const signInWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  try {
    console.log('🔍 현재 도메인:', window.location.hostname);
    console.log('🔍 현재 URL:', window.location.href);
    console.log('🔍 Auth Config:', auth.config);

    await setPersistence(auth, browserSessionPersistence);

    // Conditionally use redirect or popup based on environment mode
    if (import.meta.env.MODE === 'production') { // Assuming 'main' corresponds to production
      await signInWithRedirect(auth, provider);
      console.log('리다이렉트 로그인 시작');
    } else { // Assuming 'dev' corresponds to development
      await signInWithPopup(auth, provider);
      console.log('팝업 로그인 완료'); // Popup completes immediately
    }
  } catch (error) {
    console.error('리다이렉트 로그인 실패', error);
    throw error;
  }
};

export const getGoogleRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (error) {
    console.error('리다이렉트 결과 가져오기 실패', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try{
    await auth.signOut();
    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 실패', error);
    throw error;
  }
}
