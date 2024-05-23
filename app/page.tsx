'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import { GoogleAuthProvider } from 'firebase/auth';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css'
import Cookies from 'universal-cookie';

import { auth } from '@/db/firebase';
import { registerUser, updateLastLogin } from '@/db/utils';
import { useAppState } from '@/utils/AppStateProvider';

type TFirebaseUI = {
  default: typeof firebaseui;
  auth: typeof firebaseui.auth;
};

const BACKGROUND_IMAGE_URL: string = 'https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/Forest%20silhouette%20vector.jpg?alt=media&token=ab09391c-8c23-4a21-ac48-c2a256c2005b';

export default function Home() {
  const [firebaseui, setFirebaseUI] = useState<TFirebaseUI | null>(null);

  const router = useRouter();

  const { state, dispatch } = useAppState();
  
  const uiConfig = useMemo(() => {
    const cookies = new Cookies();

    // Initialize the FirebaseUI widget using Firebase.
    return {
      callbacks: {
        signInSuccessWithAuthResult: (authResult: any) => {
          (async () => {
            try {
              cookies.set('auth-token', authResult.credential.accessToken);
      
              const isNewUser = authResult.additionalUserInfo.isNewUser;

              const displayName = authResult.user.displayName;
              const email = authResult.user.email;
              const photoURL = authResult.user.photoURL;
              const uid = authResult.user.uid;

              // If this is the first time sign in, create a new user data and store it.
              if (isNewUser) await registerUser(displayName, email, photoURL, uid);
              // Otherwise, update the isOnline status
              else await updateLastLogin(uid);
            } catch (err) {
              console.error('Error getting document:', err);
              dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'general' });
              dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
            }
            router.push('/channels');
          })();
          // https://firebaseopensource.com/projects/firebase/firebaseui-web/#available-callbacks
          // whether we leave that to developer to handle.
          return false;
        },
      },
      signinFlow: 'popup',
      // signInSuccessUrl: '/channels',
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID
      ]
    };
  }, [dispatch, router]);

  useEffect(() => {
    const loadFirebaseUI = async () => {
      try {
        const firebaseui = await import('firebaseui');
        setFirebaseUI(firebaseui);
      } catch (error) {
        console.error('Error loading FirebaseUI:', error);
      }
    };
    loadFirebaseUI();
  }, []);

  useEffect(() => {
    if (firebaseui) {
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  }, [firebaseui, uiConfig]);

  return firebaseui ? (<>
    <div className='relative'>
      <div className='
        absolute left-0 right-0 z-10
        h-screen py-40
        flex flex-col gap-96 text-center
      '>
        {/* App name */}
        <h1 className='font-bold text-5xl text-green-950'>Soop Sok</h1>

        {/* Firebase UI */}
        <div id='firebaseui-auth-container' />
      </div>

      <Image
        src={BACKGROUND_IMAGE_URL}
        alt='background image'
        width={1668} height={2388}
        className='h-screen object-cover'
      />
    </div>
  </>) : null;
};
