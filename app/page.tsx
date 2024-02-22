'use client';

import { useEffect } from 'react';

import { uiConfig, ui } from '@/app/lib/firebase/firebase';

export default function Home() {

  useEffect(() => {
    // if (ui.isPendingRedirect() || firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Start the FirebaseUI authentication flow
      ui.start('#firebaseui-auth-container', uiConfig);
    // }
  }, []);

  return (
    <div className="pt-24 flex flex-col gap-64 items-center">
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-4xl'>Introverts</h1>
        <p className=''>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus laboriosam dolor maxime suscipit tempore corrupti odit. Assumenda molestias nostrum voluptatem?</p>
      </div>

      <div id='firebaseui-auth-container'
        className='
          border rounded-lg bg-white shadow-md
      '/>
    </div>
  );
}
