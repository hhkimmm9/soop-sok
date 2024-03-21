'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc, query,
  or, where, limit,
  setDoc, getDocs,
  serverTimestamp
} from 'firebase/firestore';

import { TUser } from '@/app/types';

const Profile = () => {
  const [user, setUser] = useState<TUser>();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  useEffect(() => {
    const fecthUser = async () => {
      if (signedInUser) {
        const q = query(collection(db, 'users'),
          where('uId', '==', params.id),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs[0].data()

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
            'interests': data.profile.interests,
            'introduction': data.profile.introduction,
          },
          'profilePicUrl': data.profilePicUrl,
          'uId': data.uId,
        });
      }
      setLoading(true);
    };

    fecthUser();

    if (signedInUser?.uid == params.id) setIsMyProfile(true);
  }, [signedInUser, params.id])

  const addUserToFriendList = async () => {
    console.log('addUserToFriendList');
  };

  const redirectToDMChat = async () => {
    // check if their dm chat exists
    const myId = signedInUser?.uid;
    const opponentId = params.id;

    const q = query(collection(db, 'chats'),
      or(where('channelId', '==', `${myId}-${opponentId}`),
         where('channelId', '==', `${opponentId}-${myId}`),
      ),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    // if it doesn't, create a dm chat room first
    if (querySnapshot.empty) {
      await setDoc(doc(db, 'chats', `${myId}-${opponentId}`), {
        'capacity': 2,
        'channelId': `${myId}-${opponentId}`,
        'createdAt': serverTimestamp(),
        'isPrivate': false,
        'name': '',
        'numUsers': 2,
        'password': ''
      });
      // redirect the user to the newly created dm chat room.
      router.push(`/chats/dm/${myId}-${opponentId}`);
    }

    // redirect the user to the dm chat room.
    router.push(`/chats/dm/${querySnapshot.docs[0].data().channelId}`);
  };

  if (user !== undefined && loading) return (
    <div className='pt-24 flex flex-col gap-12 items-center'>
      <Image
        src={user.profilePicUrl} alt=''
        width={1324} height={1827}
        className={`
          object-cover w-72 h-72 rounded-full
          ${user.isOnline ? 'border-green-400' : 'border-gray-400'}
          border-4
      `}/>
      <div className='flex flex-col gap-2'>
        <p className='text-5xl font-medium'>
          { user.displayName }
        </p>
        <p>
          { user.profile.introduction }
        </p>
      </div>
      
      <div className=''>
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

            <button onClick={redirectToDMChat} className='
                border rounded-lg py-3 bg-white
                text-center
            '>DM 보내기</button>
          </div>
        )}
      </div>
    </div>
  )
};

export default Profile;