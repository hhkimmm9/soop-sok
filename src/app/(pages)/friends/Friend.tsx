'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, firestore } from '@/utils/firebase/firebase';
import { fetchUser } from '@/utils/firebase/firestore/services';
import {
  collection, doc, query,
  or, where,
  addDoc, getDoc, getDocs,
  serverTimestamp
} from 'firebase/firestore';
import useDialogs from '@/utils/dispatcher';

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

  const { messageDialog } = useDialogs();

  useEffect(() => {
    const getUser = async () => {
      if (!auth) return;

      try {
        const user = await fetchUser(friendId);
        if (user) {
          setFriend(user as TUser);
        }
      } catch (err) {
        console.error(err);
        messageDialog.show('data_retrieval');
      }
    };
    getUser();
  }, [friendId, messageDialog]);
  
  // TODO:
  const redirectToDMChat = async () => {
    const myId = auth.currentUser?.uid;
    const opponentId = friendId;

    // check if their dm chat exists
    if (auth) {
      try {
        const q = query(collection(firestore, 'private_chats'),
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
            const chatRef = await addDoc(collection(firestore, 'private_chats'), {
              from: myId,
              to: opponentId,
              createdAt: serverTimestamp(),
            });
            // redirect the user to the newly created dm chat room.
            router.push(`/chats/private-chat/${chatRef.id}`);
          } catch (err) {
            console.error(err);
            messageDialog.show('general');
          }
        } else {
          // redirect the user to the dm chat room.
          router.push(`/chats/private-chat/${querySnapshot.docs[0].id}`);
        }
      } catch (err) {
        console.error(err);
        messageDialog.show('data_retrieval');
      }
    }
  };

  return (
    <div className='p-5 flex gap-4 rounded-lg shadow bg-white'>
      <Link
        href={`/profile/${friendId}`}
        className={`
          flex items-center rounded-full border-4
          ${friend?.isOnline ? 'border-lime-400' : 'border-red-400'}
      `}>
        <Image
          src={friend?.photoURL || NO_PIC_PLACEHOLDER}
          alt={`${friend?.displayName}'s profile picture`}
          width={48}
          height={48}
          className='object-cover w-12 h-12 rounded-full'
        />
      </Link>

      <div className='grow grid grid-cols-6'>
        <Link
          href={`/profile/${friendId}`}
          className='col-span-4 cursor-pointer'
        >
          <p className='text-xl font-medium truncate'>{friend?.displayName}</p>
          <p className='whitespace-nowrap text-gray-600'>Last login: {formatTimeAgo(friend?.lastLoginTime)}</p>
        </Link>

        <div className='col-span-2 flex items-center justify-end'>
          <button
            onClick={redirectToDMChat}
            aria-label='Direct Message'
            className='p-2 rounded-full border border-earth-100 bg-white hover:bg-earth-50 transition-colors duration-200'
          >
            <ChatBubbleBottomCenterIcon className='w-6 h-6 text-earth-600' />
          </button>
        </div>
      </div>
    </div>
  )
};

export default Friend;