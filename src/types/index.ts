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