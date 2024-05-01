'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { auth, db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { TUser, TMessage } from '@/types';

type MessageProps = {
  message: TMessage
};

const Message = ({ message } : MessageProps) => {
  const [user, setUser] = useState<TUser | null>(null);

  const { dispatch } = useAppState();

  const router = useRouter();

  // const [signedInUser, loading, error] = useAuthState(auth);

  useEffect(() => {
    const fetchUser = async () => {
      var user: TUser;
      try {
        const userRef = doc(db, 'users', message.sentBy);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = { ... userSnapshot.data() } as TUser;
          setUser(userData);
        }
      } catch (err) {
        console.error(err);
      };
    };

    fetchUser();
  }, [message.sentBy]);

  const redirectToProfile = () => {
    router.push(`/profile/${user?.uid}`);
    dispatch({ type: 'SET_TO_PAGES' });
  };

  if (user) return (
    <div className='grid grid-cols-6'>
      <div className='col-span-1 mt-2'>
        <div onClick={redirectToProfile}>
          <Image src={`${user?.photoURL}`} alt=''
            width={1324} height={1827}
            className='object-cover w-12 h-12 rounded-full'
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