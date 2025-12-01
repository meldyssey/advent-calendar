import { db, storage } from './config';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import type { ImageData } from '@/types';
import { getAuth } from 'firebase/auth';

export const uploadImage = async (
  projectId: string,
  dayNumber: number,
  file: File,
  userId: string,
  userName: string
): Promise<string> => {
  try {
    const auth = getAuth(); // Firebase Auth 인스턴스
    if (!auth.currentUser) {
      console.error("인증 오류: 현재 사용자가 로그인되어 있지 않습니다.");
      // 여기서 에러를 발생시켜 업로드를 시도조차 하지 않도록 방지
      throw new Error("User not authenticated.");
    }

    const timestamp = Date.now();
    const fileName = `${userId}__${timestamp}_${file.name}`
    const storageRef = ref(storage, `projects/${projectId}/day-${dayNumber}/${fileName}`)

    console.log('이미지 업로드 시작', fileName)
    console.log('파일 크기 (bytes):', file.size);
    console.log('파일 MIME 타입:', file.type);      
    const uploadFile = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(uploadFile.ref)
    console.log('Storage 업로드 완료', imageUrl)

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

    console.log('Firestore 메타데이터 저장 완료', docRef.id);

    return docRef.id
  } catch (error) {
    console.error('이미지 업로드 실패', error)
    throw error
  }
}

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
    console.log('이미지 조회 실패', error);
    throw error
  }
}

export const deleteImage = async(
  projectId: string,
  imageId: string,
  storagePath: string,
): Promise<void> => {
  try {

    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    console.log('이미지 삭제 완료');

    const imageRef = doc(db, 'projects', projectId, 'images', imageId)
    await deleteDoc(imageRef);
    console.log('Firestore 메타데이터 삭제 완료');
  } catch (error) {
    console.error('이미지 삭제 실패', error)
    throw error;
  } 
}