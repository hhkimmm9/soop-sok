'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { auth } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile = () => {
  const [signedInUser, loading, error] = useAuthState(auth);
  const [user, setUser] = useState({
    _id: '1',
    photoURL: 'https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/IMG_2531.jpeg?alt=media&token=a0566f94-5879-439b-9114-193f3564d378',
    displayName: '은솔공주'
  });
  const [isMyProfile, setIsMyProfile] = useState(false);

  const params = useParams();

  useEffect(() => {
    async () => {
      await fecthUser();

      // TODO: Is it ok to expose uid? If so, compare user.uid to params.uid, and if they match setIsMyProfile to true.
    }
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
          src={`${user?.photoURL}`} alt=''
          width={1324} height={1827}
          className='
            object-cover
            w-72 h-72 rounded-full
        '/>
      </div>
      <div className='
        text-5xl font-medium
      '>
        { user?.displayName }
      </div>
      
      { isMyProfile ? (
        <div className='w-72 flex flex-col gap-8'>
          <Link href={`/users/${`test`}/profile/edit`}
            className='
              border rounded-lg py-3 bg-white
              text-center
          '>프로필 수정</Link>
        </div>
      ) : (
        <div className='w-72 flex flex-col gap-8'>
          {
            // TODO: already friend? then ...
            true && (
              <button  type='button'
                onClick={addUserToFriendList}
                className='
                  border rounded-lg py-3 bg-white
                  text-center
              '>친구 추가</button>
            )
          }

          <Link href={`/chats/${user._id}?type=dm`}
            className='
              border rounded-lg py-3 bg-white
              text-center
          '>DM 보내기</Link>
        </div>
      )}
    </div>
  )
};

export default Profile;