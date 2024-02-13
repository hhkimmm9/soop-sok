'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation' ;

import {
	signInWithGoogle,
	signOut,
	onAuthStateChanged
} from "@/app/lib/firebase/auth";

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
  }, []);

  useEffect(() => {
          onAuthStateChanged((authUser: any) => {
                  if (user === undefined) return;
                  if (user?.email !== authUser?.email) {
                          router.refresh();
                  }
          });
  }, [user]);

  return user;
}

const TestHeader = ({
  initialUser
} : {
  initialUser: any
}) => {
  
  const user = useUserSession(initialUser) ;
  
  const handleSignOut = (event: any) => {
		event.preventDefault();
		signOut();
	};

  const handleSignIn = (event: any) => {
		event.preventDefault();
		signInWithGoogle();
	};

  return (
    <div>
      { user.displayName }

      { user ? (
          <Link href='#' onClick={handleSignOut}>Sign Out</Link>
        ) : (
          <Link href='#' onClick={handleSignIn}>Sign In with Google</Link>
      )}
    </div>
  )
}

export default TestHeader