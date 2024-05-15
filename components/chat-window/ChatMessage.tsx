'use client';

import Image from 'next/image';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { TUser, TMessage } from '@/types';

type MessageProps = {
  message: TMessage
};

const Message = ({ message } : MessageProps) => {
  const [user, setUser] = useState<TUser | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(db, 'users', message.sentBy);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = { ...userSnapshot.data() } as TUser;
          setUser(userData);
        }
      } catch (err) {
        console.error(err);
      };
    };

    fetchUser();
  }, [message]);

  const redirectToProfile = () => {
    if (auth) {
      router.push(`/profile/${user?.uid}`);
    }
  };

  if (user) return (
    <div className='grid grid-cols-6'>
      <div className='col-span-1 mt-2'>
        <div onClick={redirectToProfile}>
          <Image src={user.photoURL} alt='Profile Picture'
            width={48} height={48}
            className='object-cover rounded-full'
          />
        </div>
      </div>
      <div className='col-span-5 ml-2 flex flex-col gap-1'>
        <span className='text-sm text-gray-600'>{ user.displayName }</span>
        <div className='
          px-3 py-2 rounded-lg
          bg-gradient-to-b from-sky-500 to-sky-400
        '>
          <span className='text-neutral-100'>
            { message.text }
          </span>
        </div>
      </div>
    </div>
  )
};

export default Message;