'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import Image from 'next/image';
import Link from 'next/link';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import {
  collection, doc, query, where,
  addDoc, getDoc, getDocs, serverTimestamp
} from 'firebase/firestore';

import { TUser } from '@/types';

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState<TUser | null>(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isMyFriend, setIsMyFriend] = useState(false);

  const { id } = useParams();
  const router = useRouter();

  const { state, dispatch } = useAppState();

  const fetchProfileData = useCallback(async () => {
    try {
      const profileRef = doc(db, 'users', id.toString());
      const profileSnapshot = await getDoc(profileRef);

      if (profileSnapshot.exists()) {
        const profileData = profileSnapshot.data() as TUser;
        setProfile(profileData);
        setIsMyProfile(auth.currentUser?.uid === id);
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
    }
  }, [id, dispatch]);

  const checkIsMyFriend = useCallback(async () => {
    try {
      const q = query(collection(db, 'friend_list'),
        where('senderId', '==', id),
        where('receiverId', '==', id)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setIsMyFriend(true);
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
    }
  }, [id, dispatch]);

  useEffect(() => {
    const fetchDataAndCheckFriend = async () => {
      await Promise.all([fetchProfileData(), checkIsMyFriend()]);
      setIsLoading(false);
    };

    fetchDataAndCheckFriend();
  }, [fetchProfileData, checkIsMyFriend]);

  const addUserToFriendList = async () => {
    try {
      await addDoc(collection(db, 'friend_list'), {
        creaetdAt: serverTimestamp(),
        receiverId: id,
        senderId: auth.currentUser?.uid,
      });
      setIsMyFriend(true);
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_update' });
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
    }
  };

  const redirectToDMChat = async () => {
    const myId = auth.currentUser?.uid;
    const opponentId = id;

    // check if their dm chat exists
    const privateChatRef = collection(db, 'private_chats');
    const q = query(privateChatRef,
      where('from', 'in', [myId, opponentId]),
      where('to', 'in', [myId, opponentId])
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const chatRef = await addDoc(privateChatRef, {
          from: myId,
          to: opponentId,
          createdAt: serverTimestamp(),
        });
        // redirect the user to the newly created dm chat room.
        router.push(`/chats/private-chat/${chatRef.id}`);
      } else {
        // redirect the user to the dm chat room.
        router.push(`/chats/private-chat/${querySnapshot.docs[0].id}`);
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'general' });
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
    }
  };

  const renderButtonComponents = () => {
    // my profile
    if (isMyProfile) return (
      <div className='w-full flex flex-col gap-8'>
        <Link href={`/profile/${profile?.uid}/edit`}
          className='border rounded-lg py-2 block shadow-sm text-center bg-white'
        > Edit Profile </Link>
      </div>
    )
    
    // other account's profile
    else return  (
      <div className='w-full grid grid-cols-2 gap-2'>
        { isMyFriend ? (
            <button type='button' onClick={() => {}}
              className='border rounded-lg py-2 block shadow-sm bg-white
            '> Poke! (Say Hi!) </button>
          ) : (
            <button type='button' onClick={addUserToFriendList}
              className='border rounded-lg py-2 block shadow-sm bg-white
            '> Send Friend Request </button>
          )
        }
        <button type='button' onClick={redirectToDMChat}
          className='border rounded-lg py-2 block shadow-sm bg-white
        '> Send DM </button>
      </div>
    )
  };

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else if (!isLoading && profile) return (<>
    <div className='pt-10 flex flex-col gap-4'>
      {/* pic and name */}
      <div className='w-full grid grid-cols-4'>
        <div className='pl-2'>
          <Image src={profile.photoURL} alt=''
            width={128} height={128} className={`
              cols-span-1 object-cover rounded-full
          `}/>
        </div>

        <div className='cols-span-3 pl-6 flex flex-col gap-3'>
          <p className='mx-auto font-medium text-3xl whitespace-nowrap'>
            { profile.displayName }
          </p>

          <p className='
            px-2 py-1 rounded-full bg-purple-300
            font-medium text-center uppercase text-white
          '>
            { profile.profile.mbti }
          </p>
        </div>
      </div>

      {/* buttons */}
      <div>
        { renderButtonComponents() }
      </div>
      
      {/*  */}
      <div className='flex flex-col gap-4'>
        <div className='h-52 p-4 border rounded-lg overflow-y-auto bg-white'>
          <p>{ profile.profile.introduction }</p>
        </div>
      </div>
    </div>
  </>);
};

export default Page;