'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth, db } from '@/utils/firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import {
  doc,
  setDoc, getDoc, updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import Cookies from 'universal-cookie';

export default function Home() {
  const router = useRouter();

  const cookies = new Cookies();

  // Initialize the FirebaseUI Widget using Firebase.
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: (authResult: any) => {
        // store the auth token into the cookie
        // https://www.npmjs.com/package/cookies
        cookies.set('auth-token', authResult.credential.accessToken);

        const userRef = doc(db, 'users', authResult.user.uid);
        getDoc(userRef)
          .then((querySnapshot) => {
            // if this is the first time sign in, create a new user data and store it.)
            if (!querySnapshot.exists()) {
              setDoc(doc(db, 'users', authResult.user.uid), {
                createdAt: serverTimestamp(),
                displayName: authResult.user.displayName,
                email: authResult.user.email,
                friendWith: [],
                honourPoints: 0,
                isEmailVerified: true,
                isOnline: true,
                lastLoginTime: serverTimestamp(),
                photoURL: authResult.user.photoURL,
                profile: {
                  introduction: '',
                  interests: []
                },
                uid: authResult.user.uid
              });
            }
            // otherwise, update the isOnline status
            else {
              updateDoc(userRef, {
                isOnline: true,
                lastLoginTime: serverTimestamp()
              });
            };
            router.push('/components');
          })
          .catch((err) => {
            console.error('Error getting document:', err);
          })

        return true;
      },
    },
    signinFlow: 'popup',
    signInSuccessUrl: '/components',
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID
    ]
  };

  useEffect(() => {
    var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', uiConfig);  
  }, [])

  return (
    <div className="pt-24 flex flex-col gap-64 items-center">
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-4xl'>숲 속</h1>
        <p className=''>Lorem, ipsum lor sit amet consectetur adipisicing elit. Doloribus laboriosam dolor maxime suscipit tempore corrupti odit. Assumenda molestias nostrum voluptatem?</p>
      </div>
      <div className='z-10 flex flex-col gap-4 text-center'>
        <div id='firebaseui-auth-container'></div>
      </div>
      <Image src='https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/Untitled_Artwork.png?alt=media&token=6b57b2e1-c921-47ff-ae70-9cc2e96ea6c9'
        alt='background image'
        width={320}
        height={320}
        className='absolute bottom-0 w-full'
        priority={false}
      />
    </div>
  );
}
