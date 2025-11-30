import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { createOrUpdateUser } from '@/firebase/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if(currentUser){
        createOrUpdateUser(
            currentUser.uid,
            currentUser.email,
            currentUser.displayName || undefined,
            currentUser.photoURL || undefined
        ).catch(error => {
          console.error('사용자 정보 동기화 실패', error)
        });
      }

      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [])
  return { user, loading };
}
