import { db, storage } from './config';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import type { ImageData } from '@/types';
import { getAuth } from 'firebase/auth';

// 이미지 업로드
export const uploadImage = async (
  projectId: string,
  dayNumber: number,
  file: File,
  userId: string,
  userName: string
): Promise<string> => {
  try {
    const auth = getAuth(); 
    if (!auth.currentUser) {
      console.error("인증 오류: 현재 사용자가 로그인되어 있지 않습니다.");
      throw new Error("User not authenticated.");
    }

    // try {
    //     await auth.currentUser.getIdToken(true); 
    //     console.log("토큰 새로고침 완료");
    // } catch (error) {
    //     console.error("토큰 새로고침 실패:", error);
    //     throw new Error("Failed to refresh authentication token.");
    // }
    
    const timestamp = Date.now();
    const fileName = `${userId}__${timestamp}_${file.name}`
    const storageRef = ref(storage, `projects/${projectId}/day-${dayNumber}/${fileName}`)
    
    const uploadFile = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(uploadFile.ref)
    const imageRef = collection(db, 'projects', projectId, 'images');
    const docRef = await addDoc(imageRef, {
      projectId,
      dayNumber,
      userId,
      userName,
      imageUrl,
      storagePath: uploadFile.ref.fullPath,
      uploadedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error('이미지 업로드 실패', error)
    throw error
  }
}

// 특정 날짜 이미지 조회
export const getDayImages = async (
  projectId: string,
  dayNumber: number,
): Promise<ImageData[]> => {
  try {
    const imagesRef = collection(db, 'projects', projectId, 'images');
    const q = query(
      imagesRef,
      where('dayNumber', '==', dayNumber),
      orderBy('userId')
    )

    const origin = await getDocs(q);

    return origin.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        projectId: data.projectId,
        dayNumber: data.dayNumber,
        userId: data.userId,
        userName: data.userName,
        imageUrl: data.imageUrl,
        storagePath: data.storagePath || '',
        uploadedAt: data.uploadedAt?.toDate() || new Date(),
      };
    })
  } catch (error) {
    console.error('이미지 조회 실패', error);
    throw error
  }
}

// 이미지 삭제
export const deleteImage = async(
  projectId: string,
  imageId: string,
  storagePath: string,
): Promise<void> => {
  try {

    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    const imageRef = doc(db, 'projects', projectId, 'images', imageId)
    await deleteDoc(imageRef);
  } catch (error) {
    console.error('이미지 삭제 실패', error)
    throw error;
  } 
}

export const deleteProjectImages = async(
  projectId: string
): Promise<void> => {
  try {
    const storageRef = ref(storage, `projects/${projectId}`)
    const listResult = await listAll(storageRef);

    // console.log(listResult.items)
    // console.log(listResult.prefixes)

    // 하위 폴더의 아이템 삭제
    const deletePromises = listResult.prefixes.map(async (folderRef) => {
      const folderList = await listAll(folderRef);
      // console.log(folderList.items)

      // 폴더 내 모든 파일 삭제
      return Promise.all(
        folderList.items.map(itemRef => deleteObject(itemRef))
      );
    });

    await Promise.all(deletePromises);

  } catch (error) {
    console.error('프로젝트 이미지 삭제 실패', error);
    throw error;
  }
}