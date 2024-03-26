'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import {
  collection, doc,
  query, where, limit,
  getDoc, getDocs, updateDoc,
} from 'firebase/firestore';

const Settings = () => {
  const [signedInUserId, setSignedInUserId] = useState('');

  const [signOut] = useSignOut(auth);

  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  useEffect(() => {
    const fetchUser = async () => {
      if (signedInUser) {
        const userQuery = query(collection(db, 'users'), where('uId', '==', signedInUser.uid.toString()));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const profileData = userSnapshot.docs[0];
          setSignedInUserId(profileData.id);
        }
      }
    };
    fetchUser();
  }, [signedInUser])
  

  const handleSignout = async () => {
    if (signedInUser) {
      const q = query(collection(db, 'users'), where('uId', '==', signedInUser.uid), limit(1));
      const userSnapshot = await getDocs(q);
      if (!userSnapshot.empty) {
        const userRef = userSnapshot.docs[0].ref;
        await updateDoc(userRef, {
          isOnline: false
        });
      }
      // TODO: error handling
      else {

      }

      const res = await signOut();
      if (res) {
        router.push('/');
      }
    }
  };

  return (
    <div className='flex flex-col gap-4 items-center'>
      <Link href={`/users/${signedInUserId}/profile`}
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