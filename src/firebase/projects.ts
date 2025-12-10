import type { CreateProjectParams, ProjectData, UserInfo } from "@/types";
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "./config";
import { DEFAULT_THEMES } from "@/constants/themes";
import { getUsers } from "./user";

// Timestamp를 Date로 변환
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Firestore Project를 프론트에서 사용하는 ProjectData로 변환
const convertProject = (id: string, data: any): ProjectData => {
  return {
    id,
    title: data.title,
    createdBy: data.createdBy,
    members: data.members,
    startDate: timestampToDate(data.startDate),
    endDate: timestampToDate(data.endDate),
    totalDays: data.totalDays,
    isCustomTheme: data.isCustomTheme,
    createdAt: timestampToDate(data.createdAt),
  };
};

// 프로젝트 생성
export const createProject = async (params: CreateProjectParams): Promise<string> => {
  const { title, userId, startDate, endDate, totalDays, customThemes } = params;
  try {
    const projectRef = doc(collection(db, 'projects'));
    const projectId = projectRef.id;
    await setDoc(projectRef, {
      title,
      createdBy: userId,
      members: [userId],
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      totalDays: totalDays,
      createdAt: serverTimestamp(),
    });

    const padLength = String(totalDays).length;
    const daysCollectionRef = collection(db, 'projects', projectId, 'days');

    const dayPromises = [];
    for(let i = 0; i < totalDays; i++){
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);

      const dayNumber = i + 1;
      const dayId = `day${String(dayNumber).padStart(padLength, '0')}`;
      const dayDocRef = doc(daysCollectionRef, dayId);

      dayPromises.push(
        setDoc(dayDocRef,{
          dayNumber,
          date: Timestamp.fromDate(dayDate),
          theme: customThemes ? customThemes[i] : DEFAULT_THEMES[i % 25],
          themeIndex: customThemes ? i : i % 25,
          isOpened: false,
        })
      )
    }

    await Promise.all(dayPromises);
    console.log('days 서브컬렉션 생성 완료');
    return projectId; 
  } catch (error) {
    console.error('프로젝트 생성 실패:', error);
    throw error;
  }
}

// 사용자 프로젝트 모두 조회
export const getMyProjects = async (userId: string): Promise<ProjectData[]> => {
  try {
    const projectsRef = collection(db, 'projects');
    const q = query(
      projectsRef,
      where('members', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    )
    const origin = await getDocs(q);
    
    return origin.docs.map(doc => convertProject(doc.id, doc.data()))
  } catch (error) {
    console.error('프로젝트 가져오기 실패: ', error);
    throw error;
  }
};

// 특정 프로젝트 조회
export const getProject = async (projectId: string): Promise<ProjectData | null> => {
  try {
    const projectRef = doc(db, 'projects', projectId);

    const origin = await getDoc(projectRef);

    if (!origin.exists()){
      return null;
    }
    
    return convertProject(origin.id, origin.data())
  } catch (error) {
    console.error('프로젝트 가져오기 실패: ', error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId);

    await deleteDoc(projectRef)

    console.log('프로젝트 삭제 완료')
    
  } catch (error) {
    console.error('프로젝트 삭제 실패: ', error)
    throw error;
  }
}

// 멤버 추가
export const addMember = async (
  projectId: string,
  userId: string,
): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId)
    const projectDoc = await getDoc(projectRef)
    
    if(!projectDoc.exists()){
      throw new Error('프로젝트를 찾을 수 없습니다.')
    }

    const projectData = projectDoc.data();

    if(projectData.members.includes(userId)) {
      throw new Error('이미 프로젝트 멤버입니다.');
    }

    await updateDoc(projectRef, {
      members: arrayUnion(userId)
    })

    console.log('멤버 추가 완료')
  } catch (error) {
    console.error('멤버 추가 실패', error)
    throw error;
  }
}

// 멤버 조회
export const getProjectMembers = async (
  projectId: string,
): Promise<UserInfo[]> => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if(!projectDoc.exists()){
      throw new Error('프로젝트를 찾을 수 없습니다.');
    }

    const projectData = projectDoc.data();

    const memberIds = projectData.members as string[];

    const members = await getUsers(memberIds)

    return members;

  } catch (error) {
    console.error('멤버 조회 실패:', error);
    throw error;
  }
}