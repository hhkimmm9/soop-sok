'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  useSignInWithGoogle,
  useSignInWithApple
} from 'react-firebase-hooks/auth';
import Cookies from 'universal-cookie';

import SignInWithGoogle from '@/app/components/(SignInWith)/SignInWithGoogle';

export default function Home() {
  const [signInWithGoogle, loadingGoogle, errorGoogle] = useSignInWithGoogle(auth);
  const [signInWithApple, loadingApple, errorApple] = useSignInWithApple(auth);

  const [signedInUser, loading, error] = useAuthState(auth);

  const router = useRouter();

  const cookies = new Cookies();

  useEffect(() => {
    // writeFirestore();
    readFirestore();
  }, []);

  const writeFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, 'test'), {
        first: "Ada",
        last: "Lovelace",
        born: 1815
      });
      console.log(docRef.id);
    } catch (err) {
      console.error(err)
    }
  };

  const readFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'test'));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
    } catch (err) {
      console.error(err);
    };
  };

  const handleSignIn = async (signInWith: string) => {
    if (signInWith === 'google') {
      const result = await signInWithGoogle();
      console.log(result);

      // https://www.npmjs.com/package/cookies
      cookies.set('auth-token', result?.user.refreshToken);

      if (!errorGoogle) {
        router.push('/channels');
      }
    }
    
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        isOnline: true
      });
    }
  };

  return (
    <div className="pt-24 flex flex-col gap-64 items-center">
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-4xl'>Introverts</h1>
        <p className=''>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus laboriosam dolor maxime suscipit tempore corrupti odit. Assumenda molestias nostrum voluptatem?</p>
      </div>

      { !signedInUser ? (
        <div className='flex flex-col gap-4 text-center'>
          <div onClick={() => handleSignIn('google')}>
            <SignInWithGoogle />
          </div>
        </div>
      ) : (
        <p>signed in</p>
      )}

    </div>
  );
}
