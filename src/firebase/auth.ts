import { auth } from "./config";
import {
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
  type User,
} from "firebase/auth";

// 구글 로그인
export const signInWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  try {

    await setPersistence(auth, browserSessionPersistence);

    if (import.meta.env.MODE === 'production') {
      await signInWithRedirect(auth, provider);
      console.log('리다이렉트 로그인 시작');
    } else {
      await signInWithPopup(auth, provider);
      console.log('팝업 로그인 완료');
    }
  } catch (error) {
    console.error('로그인 실패', error);
    throw error;
  }
};

// 구글 리다이렉트 결과
export const getGoogleRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (error) {
    console.error('리다이렉트 결과 가져오기 실패', error);
    throw error;
  }
};

// 로그아웃
export const logout = async (): Promise<void> => {
  try{
    await auth.signOut();
    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 실패', error);
    throw error;
  }
}
