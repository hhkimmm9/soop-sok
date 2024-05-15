'use client';

import ProgressIndicator from '@/components/ProgressIndicator';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { auth, db } from '@/utils/firebase';
import { useSignOut } from 'react-firebase-hooks/auth';
import { doc, updateDoc } from 'firebase/firestore';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  
  const [signOut] = useSignOut(auth);

  const handleSignout = async () => {
    if (auth && auth.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { isOnline: false });
      } catch (err) {
        console.error(err);
      }

      const res = await signOut();
      if (res) router.push('/');
    }
  };

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (
    <div className='flex flex-col gap-4 items-center'>
      <Link href={`/profile/${auth.currentUser?.uid}`} className='
        w-full py-4 rounded-lg shadow-md bg-green-800
        font-medium text-center text-base text-white
        transition duration-300 ease-in-out hover:bg-green-600
      '> Profile </Link>

      <button onClick={handleSignout} className='
        w-full py-4 rounded-lg shadow-md bg-green-800
        font-medium text-base text-white
        transition duration-300 ease-in-out hover:bg-red-500
      '> Sign Out </button>
    </div>
  )
};

export default Settings;