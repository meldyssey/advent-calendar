import { auth } from "./config";
import { 
  signInWithPopup, 
  GoogleAuthProvider ,
  setPersistence,
  browserSessionPersistence,
  type User,
} from "firebase/auth";

export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  try {
    await setPersistence(auth, browserSessionPersistence);

    const result = await signInWithPopup(auth, provider);
    console.log('로그인 성공', result.user);
    return result.user;
  } catch (error) {
    console.error('로그인 실패', error)
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