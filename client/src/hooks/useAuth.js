// useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '../Firebase';

export const useAuth = () => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    auth.signOut();
    localStorage.clear();
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setUser(user);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe(); // Clean up the listener on unmount
    };
  }, [auth]);

  return { user, isLoading, logout };
};