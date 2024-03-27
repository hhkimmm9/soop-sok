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
  addDoc, getDoc, getDocs,
  serverTimestamp
} from 'firebase/firestore';

import { TUser } from '@/app/types';

const Profile = () => {
  const [profile, setProfile] = useState<TUser>();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  useEffect(() => {
    const fetchData = async () => {
      if (signedInUser) {
        try {
          // fetch profile data with the given id in the URL.
          const profileRef = doc(db, 'users', id.toString());
          const profileSnapshot = await getDoc(profileRef);
  
          if (profileSnapshot.exists()) {
            const profileData = { ...profileSnapshot.data() } as TUser;
            setProfile(profileData);
            setIsMyProfile(signedInUser.uid === id);
          }
        } catch (err) {
          console.error(err);
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
    const myId = signedInUser?.uid;
    const opponentId = id;

    // check if their dm chat exists
    const q = query(collection(db, 'private_chats'),
      or(
        (where('from', '==', myId), where('to', '==', opponentId)),
        (where('to', '==', myId), where('from', '==', opponentId))
      ),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    // if it doesn't, create a dm chat room first
    if (querySnapshot.empty) {
      const docRef = await addDoc(collection(db, 'private_chats'), {
        from: myId,
        to: opponentId,
        createdAt: serverTimestamp(),
      });
      // redirect the user to the newly created dm chat room.
      router.push(`/chats/dm/${docRef.id}`);
    } else {
      // redirect the user to the dm chat room.
      router.push(`/chats/dm/${querySnapshot.docs[0].id}`);
    }
  };

  if (profile !== undefined && loading) return (
    <div className='pt-24 flex flex-col gap-12 items-center'>
      <Image
        src={profile.photoURL} alt=''
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
            <Link href={`/users/${profile.uid}/profile/edit`}
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