import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/firebase/config';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [])
  return { user, loading };
}
