'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  signInWithGoogle,
  signOut,
	onAuthStateChanged
} from "@/app/lib/firebase/auth";
import { useRouter } from 'next/navigation';

import { auth } from '@/app/lib/firebase/firebase';

function useUserSession(initialUser: any) {
  // The initialUser comes from the server through a server component
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: any) => {
      setUser(authUser);
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser: any) => {
      if (user === undefined) return;
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return user;
};

const AuthTest = ({
  initialUser
} : {
  initialUser: any
}) => {

  console.log(auth);

  // const user = useUserSession(initialUser);
  const user = auth.currentUser;

  const handleSignOut = (event: any) => {
		event.preventDefault();
		signOut();
	};

  const handleSignIn = (event: any) => {
		event.preventDefault();
    signInWithGoogle();
	};

  return (
    <>
      { user ? (
          <Link href='#' onClick={handleSignOut}>Sign Out</Link>
        ) : (
          <Link href='#' onClick={handleSignIn}>Sign In with Google</Link>
      )}
    </>
  )
};

export default AuthTest;