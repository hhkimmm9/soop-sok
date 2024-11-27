'use client';

import { Avatar, } from '@mui/material';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { auth } from '@/utils/firebase/firebase';
import { useRouter } from 'next/navigation';
import { fetchUser } from '@/utils/firebase/firestore/services';

import { TUser } from '@/types';

type UserProps = {
  uid: string
};

const User = ({ uid }: UserProps) => {
  const [user, setUser] = useState<TUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getuser = async () => {
      const user = await fetchUser(uid);
      setUser(user);
    };
    getuser()
  }, [uid]);

  const redirectToProfile = (uid: string) => {
    if (auth) {
      router.push(`/profile/${uid}`);
    }
  };

  if (user) return (
    <li
      onClick={() => redirectToProfile(user.uid)}
      className='
        p-3 rounded-lg shadow-sm bg-stone-200
        flex items-center justify-between
    '>
      <div className='w-full px-2 py-1 flex items-center gap-3'>
        {/* <Avatar src={user.profilePicUrl} alt='Profile Picture' sx={{ width: 52, height: 52 }} /> */}
        <Image
          src={user.photoURL} alt='Profile Picture'
          width={64} height={64}
          className='object-cover rounded-full'
        />
        <p className='text-lg'>{ user.displayName }</p>
      </div>
    </li>
  )
};

export default User;