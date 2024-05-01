'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { auth, db } from '@/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';

const Settings = () => {
  const router = useRouter();
  
  const [signedInUser] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  const handleSignout = async () => {
    if (signedInUser) {
      try {
        const userRef = doc(db, 'users', signedInUser.uid);
        await updateDoc(userRef, { isOnline: false });
      } catch (err) {
        console.error(err);
      }

      const res = await signOut();
      if (res) router.push('/');
    }
  };

  return (
    <div className='flex flex-col gap-4 items-center'>
      <Link href={`/profile/${signedInUser?.uid}`} className='
        w-full border rounded-lg p-2 bg-white text-center shadow-sm'
      > Profile </Link>

      <button onClick={handleSignout} className='
        w-full border rounded-lg p-2 bg-white shadow-sm'
      > Sign Out </button>
    </div>
  )
};

export default Settings;