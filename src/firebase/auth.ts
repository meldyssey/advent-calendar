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
    await setPersistence(auth, browserSessionPersistence);
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('로그인 실패', error);
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
