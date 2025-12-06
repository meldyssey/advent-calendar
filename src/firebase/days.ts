import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './config';
import type { DayData } from '@/types';

// 날짜 데이터 조회
export const getDays = async (projectId: string): Promise<DayData[]> => {
  try {
    const daysRef = collection(db, 'projects', projectId, 'days');
    const q = query(daysRef, orderBy('dayNumber', 'asc'))

    const origin = await getDocs(q);

    return origin.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        dayNumber: data.dayNumber,
        date: data.date.toDate(),
        theme: data.theme,
        themeIndex: data.themeIndex,
        isOpened: data.isOpened
      };
    });
  } catch (error) {
    console.error('날짜 데이터 가져오기 실패:', error);
    throw error;
  }
}
