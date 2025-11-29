import type { Timestamp } from "firebase/firestore";

// firebase 정보
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// 사용자 정보
export interface UserInfo {
  uid: string;
  email: string | null;
  displayName?: string;
  photoURL?: string;
}

// Firestore에 저장되는 프로젝트 정보
export interface Project {
  id: string; // Firestore document ID    
  title: string;
  createdBy: string; // 사용자 uid
  members: string[]; // 프로젝트 오너 포함 사용자 uid
  startDate: Timestamp;
  endDate: Timestamp;
  totalDays: number;
  isCustomTheme: boolean;
  createdAt: Timestamp;
}

// UI에서 사용하는 Date 변환 프로젝트 정보
export interface ProjectData {
  id: string; // Firestore document ID    
  title: string;
  createdBy: string; // 사용자 uid
  members: string[]; // 프로젝트 오너 포함 사용자 uid
  startDate: Date;
  endDate: Date;
  totalDays: number;
  isCustomTheme: boolean;
  createdAt: Date;
}

// 프로젝트 생성 파라미터
export interface CreateProjectParams {
  title: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  customThemes?: string[];
}

// Firestore에 저장되는 Day
export interface Day {
  id: string; // Firestore document ID    
  dayNumber: number;
  date: Timestamp;
  theme: string;
  themeIndex: number;
  isOpened: boolean;
}

export interface DayData {
  id: string; // Firestore document ID    
  dayNumber: number;
  date: Date;
  theme: string;
  themeIndex: number;
  isOpened: boolean;
}

export interface Image {
  id: string;
  dayNumber: number;
  userId: string;
  userName: string;
  imageUrl: string;
  uploadedAt: Timestamp;
}


export interface Image {
  id: string;
  dayNumber: number;
  userId: string;
  userName: string;
  imageUrl: string;
  uploadedAt: Timestamp;
}