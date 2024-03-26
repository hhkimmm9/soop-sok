'use client';

import { useRouter } from 'next/navigation';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, query,
  where, limit,
  addDoc, getDocs, updateDoc,
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
  // const [signInWithApple, loadingApple, errorApple] = useSignInWithApple(auth);

  const [signedInUser, loading, error] = useAuthState(auth);

  const router = useRouter();

  const cookies = new Cookies();

  const handleSignIn = async (signInWith: string) => {
    if (signInWith === 'google') {
      const result = await signInWithGoogle();

      // store the auth token into the cookie
      // https://www.npmjs.com/package/cookies
      cookies.set('auth-token', result?.user.refreshToken);

      // check if the user is signed in
      if (result && signedInUser) {
        // if their profile isn't found in the database, create a new one
        const q = query(collection(db, 'users'),
          where('uId', '==', signedInUser.uid),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        // if this is the first time sign in, create a new user data and store it.
        if (querySnapshot.empty) {
          await addDoc(collection(db, 'users'), {
            createdAt: serverTimestamp(),
            displayName: result.user.displayName,
            email: result.user.email,
            friendWith: [],
            honourPoints: 0,
            isEmailVerified: true,
            isOnline: true,
            lastLoginTime: serverTimestamp(),
            profile: {
              introduction: '',
              interests: []
            },
            profilePicUrl: result.user.photoURL,
            uId: signedInUser.uid
          });
        }
        // otherwise, update the isOnline status
        else {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userRef = querySnapshot.docs[0].ref;
            await updateDoc(userRef, {
              isOnline: true,
              lastLoginTime: serverTimestamp()
            });
          }
        }

        if (!errorGoogle) router.push('/channels');
      }
    }
  };

  return (
    <div className="pt-24 flex flex-col gap-64 items-center">
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-4xl'>숲 속</h1>
        <p className=''>Lorem, ipsum lor sit amet consectetur adipisicing elit. Doloribus laboriosam dolor maxime suscipit tempore corrupti odit. Assumenda molestias nostrum voluptatem?</p>
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
