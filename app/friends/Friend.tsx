'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { fetchUser } from '@/db/utils';
import {
  collection, doc, query,
  or, where,
  addDoc, getDoc, getDocs,
  serverTimestamp
} from 'firebase/firestore';

import { TUser } from '@/types';
import { formatTimeAgo } from '@/utils/functions';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

const NO_PIC_PLACEHOLDER = 'https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/No%20Image.png?alt=media&token=18067651-9566-4522-bf2e-9a7963731676';

type FriendProp = {
  friendId: string
};

export const Friend = ({ friendId }: FriendProp ) => {
  const [friend, setFriend] = useState<TUser | null>(null);

  const router = useRouter();

  const { dispatch } = useAppState();

  useEffect(() => {
    const getUser = async () => {
      if (auth) {
        
        try {
          const user = await fetchUser(friendId);
          
          if (!user) {
            
          }

          setFriend(user as TUser);
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });
        }
      }
    };
    getUser();
  }, [dispatch, friendId]);
  
  const redirectToDMChat = async () => {
    const myId = auth.currentUser?.uid;
    const opponentId = friendId;

    // check if their dm chat exists
    if (auth) {
      try {
        const q = query(collection(db, 'private_chats'),
          or(
            (where('from', '==', myId), where('to', '==', opponentId)),
            (where('from', '==', opponentId), where('to', '==', myId)),
          )
        );
        // TODO: add havePrivateChat to friend_list
        const querySnapshot = await getDocs(q);
    
        // if it doesn't, create a dm chat room first
        if (querySnapshot.empty) {
          try {
            // TODO: createPrivateChat
            const chatRef = await addDoc(collection(db, 'private_chats'), {
              from: myId,
              to: opponentId,
              createdAt: serverTimestamp(),
            });
            // redirect the user to the newly created dm chat room.
            router.push(`/chats/private-chat/${chatRef.id}`);
          } catch (err) {
            console.error(err);
            dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'general' } });
          }
        } else {
          // redirect the user to the dm chat room.
          router.push(`/chats/private-chat/${querySnapshot.docs[0].id}`);
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });
      }
    }
  };

  if (friend) return (
    <div className='p-5 rounded-lg shadow-md bg-white flex gap-4'>
      <Link href={`/profile/${friendId}`} className='flex items-center'>
        { friend?.photoURL !== undefined ? (
          <Image src={friend?.photoURL} alt=''
            width={1324} height={1827} className='object-cover w-12 h-12 rounded-full'
          />
        ) : (
          <Image
            src={NO_PIC_PLACEHOLDER}
            alt=''
            width={1324} height={1827}
            className='object-cover w-12 h-12 rounded-full'
          />
        )} 
      </Link>

      <div className='grow grid grid-cols-6'>
        <div className='col-span-4'>
          {/* last signed in, where they are */}
          <div className='flex gap-4 items-center'>
            <p className='text-lg font-semibold'>{ friend.displayName }</p>
            { friend.isOnline === true ? (
              <p className='px-2 rounded-full bg-lime-400'>Online</p>
            ) : (
              <p className='px-2 rounded-full bg-red-400'>Offline</p>
            )}
            
          </div>
          <p>Last login: { formatTimeAgo(friend?.lastLoginTime) }</p>
        </div>

        <div className='col-span-2 flex items-center justify-end'>
          <div onClick={redirectToDMChat} className='p-3 rounded-full border'>
            <ChatBubbleBottomCenterIcon className='w-5 h-5' />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Friend;