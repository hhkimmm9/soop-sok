'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

const Settings = () => {
  const [signOut] = useSignOut(auth);

  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  const handleSignout = async () => {
    if (auth.currentUser) {
      const q = query(collection(db, 'users'), where('uId', '==', auth.currentUser.uid), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userRef = querySnapshot.docs[0].ref;
        await updateDoc(userRef, {
          isOnline: false
        });
      }

      const res = await signOut();
      if (res) {
        router.push('/');
      }
    }
  };

  return (
    <div className='flex flex-col gap-4 items-center'>
      <Link href={`/users/${signedInUser?.uid}/profile`}
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