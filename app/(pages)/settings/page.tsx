'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useSignOut } from 'react-firebase-hooks/auth';
import {
  doc,
  updateDoc,
} from 'firebase/firestore';

const Settings = () => {
  const [signOut] = useSignOut(auth);

  const router = useRouter();

  const handleSignout = async () => {
    if (auth.currentUser) {
      console.log(auth.currentUser)
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        isOnline: false
      });
    }
    
    const res = await signOut();

    if (res) {
      router.push('/');
    }
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