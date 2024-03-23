'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc,
  query, where, orderBy, limit,
  getDoc, getDocs
} from 'firebase/firestore';

import { TMessage, TPrivateChat, TUser } from '@/app/types';

type DirectMessageProps = {
  privateChat: TPrivateChat
};

const DirectMessage = ({ privateChat } : DirectMessageProps ) => {
  const [toUser, setToUser] = useState<TUser>();
  const [latestMessage, setLatestMessage] = useState<TMessage>();

  // fetch user data based on the given user id,
  // or, store user data into the private_chat collection.
  useEffect(() => {
    const fetchToUser = async () => {
      const userSnapshot = await getDoc(doc(db, 'users', privateChat.to));
      if (userSnapshot.exists()) {
        const data = {
          id: userSnapshot.id,
          ...userSnapshot.data()
        } as TUser;
        setToUser(data);
      }
    };
    fetchToUser();
  }, [privateChat.to]);

  // fetch the latest message associated with this private chat
  // to display when it is sent and the content of it.
  useEffect(() => {
    const fetchLatestMessage = async () => {
      const messageQuery = query(collection(db, 'messages'),
        where('chatId', '==', privateChat.id),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const messageSnapshot = await getDocs(messageQuery);
      if (!messageSnapshot.empty) {
        const data = {
          id: messageSnapshot.docs[0].id,
          ...messageSnapshot.docs[0].data()
        } as TMessage
        setLatestMessage(data);
      }
    };
    fetchLatestMessage();
  }, [privateChat.id]);

  const convertTiem = (seconds: number | undefined) => {
    if (typeof seconds === 'number') {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeDifference = currentTime - seconds;
  
      const minutes = Math.floor(timeDifference / 60);
      if (minutes === 0) {
        return "Just now";
      } else if (minutes === 1) {
        return "1 minute ago";
      } else {
        return minutes + " minutes ago";
      }
    }
  }

  return (
    <Link href={`/chats/dm/${privateChat.id}`}>
      <div className='
        bg-white border border-black px-3 py-2 rounded-lg
        flex gap-3 items-center
      '>
        <Image
          src='https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/IMG_2531.jpeg?alt=media&token=a0566f94-5879-439b-9114-193f3564d378' alt=''
          width={1324} height={1827}
          className='
            object-cover
            w-16 h-16
            rounded-full
        '/>

        {/*  */}
        <div className='grow w-min'>
          {/*  */}
          <div className='flex justify-between'>
            <p>{ toUser?.displayName }</p>
            <p>{ convertTiem(latestMessage?.createdAt.seconds) }</p>
          </div>

          {/*  */}
          <div className='mt-1'>
            <p className='
              h-[3rem]
              overflow-hidden
              line-clamp-2
            '>{ latestMessage?.text }</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default DirectMessage