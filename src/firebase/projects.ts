import type { CreateProjectParams, ProjectData } from "@/types";
import { collection, doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./config";
import { DEFAULT_THEMES } from "@/constants/themes";

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

    console.log('projectId:', projectId)

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