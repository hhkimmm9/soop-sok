'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { auth } from '@/db/firebase';
import { updateUserStatus } from '@/db/utils';
import { useSignOut } from 'react-firebase-hooks/auth';

const Settings = () => {
  const router = useRouter();
  
  const [signOut] = useSignOut(auth);

  const handleSignout = async () => {
    if (auth && auth.currentUser) {
      // Toggle isLogin to off.
      try {
        const res = await updateUserStatus(auth.currentUser.uid, 'signout');

        // Error handling: session expired.
        if (!res) {
          // 
        }
      }
      // 
      catch (err) {
        console.error(err);
      }

      // Clean up the user session.
      try {
        await signOut();
      }
      // 
      catch (err) {
        console.error(err);
      }

      router.push('/');
    }
  };

  return (
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