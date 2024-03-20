'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

import { TUser } from '@/app/types';

const Profile = () => {
  const [user, setUser] = useState<TUser>();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();

  const [signedInUser] = useAuthState(auth);

  useEffect(() => {
    const fecthUser = async () => {
      if (signedInUser) {
        const querySnapshot = await getDoc(
          doc(db, 'users', signedInUser.uid)
        );
        const data = querySnapshot.data();

        if (data) setUser({
          'createdAt': data.createdAt,
          'displayName': data.displayName,
          'email': data.email,
          'friendWith': data.friendWith,
          'honourPoints': data.honourPoints,
          'isEmailVerified': data.isEmailVerified,
          'isOnline': data.isOnline,
          'lastLoginTime': data.lastLoginTime,
          'profile': {
            'interests': [],
            'introduction': '',
          },
          'profilePicUrl': data.profilePicUrl,
          'uId': data.uId,
        });
      }
      setLoading(true);
    };

    fecthUser();
  }, [signedInUser])

  useEffect(() => {
    if (user?.uId == params.id) setIsMyProfile(true);
  }, [user, params.id]);

  const addUserToFriendList = async () => {
    console.log('addUserToFriendList');
  };

  if (user !== undefined && loading) return (
    <div className='pt-24 flex flex-col gap-16 items-center'>
      <Image
        src={user.profilePicUrl} alt=''
        width={1324} height={1827}
        className={`
          object-cover w-72 h-72 rounded-full
          ${user.isOnline ? 'border-green-400' : 'border-gray-400'}
          border-4
      `}/>
      <p className='text-5xl font-medium'>
        { user?.displayName }
      </p>
      
      { isMyProfile ? (
        <div className='w-72 flex flex-col gap-8'>
          <Link href={`/users/${user.uId}/profile/edit`}
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

          <Link href={`/chats/${user?.uId}?type=dm`}
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