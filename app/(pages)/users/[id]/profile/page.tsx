'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/app/lib/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile = () => {
  const [signedInUser, loading, error] = useAuthState(auth);
  const [user, setUser] = useState({
    photoURL: 'https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/IMG_2531.jpeg?alt=media&token=a0566f94-5879-439b-9114-193f3564d378',
    displayName: '은솔공주'
  });

  useEffect(() => {
    fecthUser()
  }, [])

  const fecthUser = async () => {
    console.log('fecthUser called');

    // const res = await fetch('/api/', {
    //   method: 'GET',
    // })
  };

  const addUserToFriendList = async () => {
    console.log('addUserToFriendList');
  };

  if (!loading) return (
    <div className='
      pt-24 flex flex-col gap-16 items-center
    '>
      <div className=''>
        <Image
          src={`${user?.photoURL}`}
          alt=''
          width={1324}
          height={1827}
          className='
            object-cover
            w-72 h-72
            rounded-full
        '/>
      </div>
      <div className='
        text-5xl
        font-medium
      '>
        { user?.displayName }
      </div>
      
      { signedInUser ? (
        <div className='w-72 flex flex-col gap-8'>
          <Link href={`/users/${`test`}/profile/edit`}
            className='
              border
              py-3
              rounded-lg
              text-center
              bg-white
          '>프로필 수정</Link>
        </div>
      ) : (
        <div className='w-72 flex flex-col gap-8'>
          <button  type='button'
            onClick={addUserToFriendList}
            className='
              border
              py-3
              rounded-lg
              text-center
              bg-white
          '>친구 추가</button>

          <Link href='/direct-messages'
            className='
              border
              py-3
              rounded-lg
              text-center
              bg-white
          '>DM 보내기</Link>
        </div>
      )}
    </div>
  )
};

export default Profile;