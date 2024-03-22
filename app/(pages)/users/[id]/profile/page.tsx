'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc, query,
  or, where, limit,
  setDoc, getDoc, getDocs,
  serverTimestamp
} from 'firebase/firestore';

import { TUser } from '@/app/types';

const Profile = () => {
  const [profile, setProfile] = useState<TUser>();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [signedInUserId, setSignedInUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  useEffect(() => {
    const fetchData = async () => {
      if (signedInUser) {
        // fetch profile data with the given id in the URL.
        const profileSnapshot = await getDoc(doc(db, 'users', id.toString()));
        if (profileSnapshot.exists()) {
          const profileData = {
            id:profileSnapshot.id,
            ...profileSnapshot.data()
          } as TUser;
          setProfile(profileData);
        }

        const myAccountQuery = query(collection(db, 'users'),
          where('uId', '==', signedInUser.uid)
        );
        const myAccountSnapshot = await getDocs(myAccountQuery);
        if (!myAccountSnapshot.empty) {
          const myAccountId = myAccountSnapshot.docs[0].id;
          setSignedInUserId(myAccountId);
          setIsMyProfile(myAccountId === id);
        }
      }
      setLoading(true);
    };

    fetchData();
  }, [signedInUser, id])

  const addUserToFriendList = async () => {
    console.log('addUserToFriendList');
  };

  const redirectToDMChat = async () => {
    const myId = signedInUserId;
    const opponentId = id;

    // check if their dm chat exists
    const q = query(collection(db, 'chats'),
      or(
        where('channelId', '==', `${myId}-${opponentId}`),
        where('channelId', '==', `${opponentId}-${myId}`),
      ),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    // if it doesn't, create a dm chat room first
    if (querySnapshot.empty) {
      await setDoc(doc(db, 'chats', `${myId}-${opponentId}`), {
        capacity: 2,
        channelId: `${myId}-${opponentId}`,
        createdAt: serverTimestamp(),
        isPrivate: false,
        name: '',
        numUsers: 2,
        password: ''
      });
      // redirect the user to the newly created dm chat room.
      router.push(`/chats/dm/${myId}-${opponentId}`);
    } else {
      // redirect the user to the dm chat room.
      router.push(`/chats/dm/${querySnapshot.docs[0].data().channelId}`);
    }
  };

  if (profile !== undefined && loading) return (
    <div className='pt-24 flex flex-col gap-12 items-center'>
      <Image
        src={profile.profilePicUrl} alt=''
        width={1324} height={1827}
        className={`
          object-cover w-72 h-72 rounded-full
          ${profile.isOnline ? 'border-green-400' : 'border-gray-400'}
          border-4
      `}/>
      <div className='flex flex-col gap-2'>
        <p className='text-5xl font-medium'>
          { profile.displayName }
        </p>
        <p>
          { profile.profile.introduction }
        </p>
      </div>
      
      <div className=''>
        { isMyProfile ? (
          <div className='w-72 flex flex-col gap-8'>
            <Link href={`/users/${profile.uId}/profile/edit`}
              className='
                border rounded-lg py-3 bg-white
                text-center
            '>Edit Profile</Link>
          </div>
        ) : (
          <div className='w-72 flex flex-col gap-8'>
            {
              // TODO: already friend? then ...
              true && (
                <button type='button' onClick={addUserToFriendList}
                  className='
                    border rounded-lg py-3 bg-white
                    text-center
                '>Send Friend Request</button>
              )
            }

            <button onClick={redirectToDMChat}
              className='
                border rounded-lg py-3 bg-white
                text-center
            '>Send DM</button>
          </div>
        )}
      </div>
    </div>
  )
};

export default Profile;