'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

import { TUser, TMessage } from '@/app/types';

type MessageProps = {
  message: TMessage
};

const Message = ({ message } : MessageProps) => {
  const [user, setUser] = useState<TUser | null>(null);

  // const [signedInUser, loading, error] = useAuthState(auth);

  useEffect(() => {
    const fetchUser = async () => {
      var user: TUser;
      try {
        const q = query(collection(db, 'users'), where('uId', '==', message.sentBy));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const userData = { ...doc.data() } as TUser;
          setUser(userData);
        });
      } catch (err) {
        console.error(err);
      };
    };

    fetchUser();
  }, [message.sentBy]);

  if (user) return (
    <div className='grid grid-cols-6'>
      <div className='col-span-1 mt-2'>
        <Link href={`/users/${user?.uid}/profile`}>
          <Image
            src={`${user?.photoURL}`}
            alt=''
            width={1324}
            height={1827}
            className='
              object-cover
              w-12 h-12
              rounded-full
          '/>
        </Link>
      </div>
      <div className='col-span-5 ml-2 flex flex-col gap-1'>
        <span className='text-sm text-gray-600'>{ user.displayName }</span>
        <div className='
          px-3 py-2 rounded-lg
          bg-gradient-to-b from-sky-500 to-sky-400
        '>
          <span className='
            text-neutral-100
          '>{ message.text }</span>
        </div>
      </div>
    </div>
  )
};

export default Message;