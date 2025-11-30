import { auth } from "./config";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

export const signInWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  try {
    console.log('🔍 현재 도메인:', window.location.hostname);
    console.log('🔍 현재 URL:', window.location.href);
    console.log('🔍 Auth Config:', auth.config);

    await setPersistence(auth, browserSessionPersistence);
    await signInWithRedirect(auth, provider);
  } catch (error: unknown) {
    console.error('로그인 실패', error);
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('❌ 에러 코드:', error.code);
      console.error('❌ 에러 메시지:', 'message' in error ? error.message : 'Unknown error');
    }
    throw error;
  }
}

export const logout = async (): Promise<void> => {
  try{
    await auth.signOut();
    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 실패', error);
    throw error;
  }
}
