'use client';

import Link from 'next/link';

import { auth } from '@/app/utils/firebase/firebase';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';

const Settings = () => {
  const [signOut, loading, error] = useSignOut(auth);

  const handleSignout = async () => {
    const res = await signOut();
  };

  return (
    <div className='flex flex-col gap-4 items-center'>
      <Link href={`/users/${1}/profile`}
        className='
          w-full border rounded-lg p-2 bg-white text-center shadow-sm
      '>Profile</Link>
      <button onClick={handleSignout}
        className='
          w-full border rounded-lg p-2 bg-white shadow-sm
      '>Sign Out</button>
    </div>
  )
};

export default Settings;