'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth } from '@/utils/firebase/firebase';
import { fetchUser } from '@/utils/firebase/firestore';
import useDialogs from '@/utils/dispatcher';

import { TUser } from '@/types';
import { formatTimeAgo } from '@/utils/functions';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

import { getOrCreateChatId } from '@/utils/firebase/firestore';

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
  
  const redirectToDMChat = async () => {
    const myId = auth.currentUser?.uid;
    const opponentId = friendId;

    if (!myId || !opponentId) return;

    // check if their dm chat exists
    if (auth) {
      try {
        const chat = await getOrCreateChatId(myId, friendId);
  
        if (chat) {
          router.push(`/chats/private-chat/${chat.id}`);
          return;
        }
      } catch (err) {
        console.error(err);
        messageDialog.show('data_retrieval');
      }
    }
  };

  return (
    <div className='p-5 flex gap-4 rounded-lg shadow bg-white'>
      <Link href={`/profile/${friendId}`}
        className={`
          h-min flex items-center rounded-full border-4
          ${friend?.isOnline ? 'border-lime-400' : 'border-red-400'}
      `}>
        <Image
          src={friend?.photoURL || NO_PIC_PLACEHOLDER}
          alt={`${friend?.displayName}'s profile picture`}
          width={48}
          height={48}
          className='object-cover w-10 h-10 rounded-full'
        />
      </Link>

      <div className='grow grid grid-cols-6'>
        <Link href={`/profile/${friendId}`}
          className='col-span-4 cursor-pointer'
        >
          <p className='text-lg font-medium truncate'>{ friend?.displayName }</p>
          <p className='whitespace-nowrap text-sm text-gray-600'>
            Last login: { formatTimeAgo(friend?.lastLoginTime) }
          </p>
        </Link>

        <div className='col-span-2 flex items-center justify-end'>
          <button
            onClick={redirectToDMChat}
            aria-label='Direct Message'
            className='
              p-2 rounded-full border border-earth-100 bg-white
              transition-colors duration-200 hover:bg-earth-50
          '>
            <ChatBubbleBottomCenterIcon className='w-5 h-5 text-earth-600' />
          </button>
        </div>
      </div>
    </div>
  )
};

export default Friend;