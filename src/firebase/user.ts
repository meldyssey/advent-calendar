import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import type { UserInfo } from "@/types";

// 사용자 정보 생성 및 업데이트
export const createOrUpdateUser = async (
  uid: string,
  email: string | null,
  displayName?: string,
  photoURL?: string, 
) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if(!userDoc.exists()) {
      await setDoc(userRef, {
        uid,
        email: email || '',
        displayName: displayName || email?.split('@')[0] || '익명',
        photoURL: photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log('사용자 정보 저장 완료')
    } else {
      await updateDoc(userRef, {
        email: email || userDoc.data().email,
        displayName: displayName || userDoc.data().displayName,
        photoURL: photoURL || userDoc.data().photoURL,
        updatedAt: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error('사용자 정보 저장 실패', error);
    throw error;
  }  
}

// 사용자 정보 조회
export const getUser = async (
  uid: string,
): Promise<UserInfo | null> => {
  try {
    const userRef = doc(db, 'users', uid)
    const userDoc = await getDoc(userRef)

    if(!userDoc.exists()){
      return null;
    }

    const data = userDoc.data();
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
    };
  } catch (error) {
    console.error('사용자 정보 조회 실패', error);
    return null;
  }
}

// 여러 사용자 정보 조회
export const getUsers = async (
  uids: string[]
): Promise<UserInfo[]> => {
  try {
    const users = await Promise.all(
      uids.map(async (uid) => {
        const user = await getUser(uid);
        return user || {
          uid,
          email: null,
          displayName: '알 수 없음',
          photoURL: '',
        };
      })
    );

    return users;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    return [];
  }
};