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
    <div>
      <h1 className='my-8 font-semibold text-3xl text-center text-earth-600'>Settings</h1>
      <div className='flex flex-col gap-4 items-center'>
      <Link href={`/profile/${auth.currentUser?.uid}`} className='
        w-full py-3 rounded-lg shadow border border-earth-300 bg-white
        font-semibold text-center text-base text-earth-500
        hover:border-earth-500 hover:bg-earth-500 hover:text-white
        transition duration-300 ease-in-out
      '> Profile </Link>

      <button onClick={handleSignout} className='
        w-full py-3 rounded-lg shadow border border-earth-300 bg-white
        font-semibold text-base text-earth-500
        hover:border-red-500 hover:bg-red-500 hover:text-white
        transition duration-300 ease-in-out
      '> Sign Out </button>
      </div>
    </div>
  )
};

export default Settings;