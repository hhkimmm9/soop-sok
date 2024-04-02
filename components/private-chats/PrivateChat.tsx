'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useAppState } from '@/utils/AppStateProvider';

import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc,
  query, where, orderBy, limit,
  getDoc, getDocs
} from 'firebase/firestore';

import { TMessage, TPrivateChat, TUser } from '@/types';
import { formatTimeAgo } from '@/utils/utils';

type PrivateChatProps = {
  privateChat: TPrivateChat
};

const PrivateChat = ({ privateChat } : PrivateChatProps ) => {
  const [toUser, setToUser] = useState<TUser>();
  const [latestMessage, setLatestMessage] = useState<TMessage>();
  const [activateChatWindow, setActivateChatWindow] = useState(false);

  const { dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);

  // fetch user data based on the given user id,
  // or, store user data into the private_chat collection.
  useEffect(() => {
    const fetchToUser = async () => {
      if (signedInUser) {
        try {
          const uid = privateChat.to === signedInUser.uid ?
            privateChat.from : privateChat.to;
  
          const userSnapshot = await getDoc(doc(db, 'users', uid));
          if (userSnapshot.exists()) {
            const data = { ...userSnapshot.data() } as TUser;
            setToUser(data);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchToUser();
  }, [privateChat.to, privateChat.from, signedInUser]);

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

  const enterPrivateChat = () => {
    dispatch({ type: 'ENTER_PRIVATE_CHAT', privateChatId: privateChat.id });
  };

  return (
    <div onClick={enterPrivateChat}>
      <div className='
        bg-white border border-black px-3 py-2 rounded-lg
        flex gap-3 items-center
      '>
        { toUser && (
          <Image
            src={toUser?.photoURL} alt=''
            width={1324} height={1827}
            className='
              object-cover
              w-16 h-16
              rounded-full
          '/>
        )}

        {/*  */}
        <div className='grow w-min'>
          {/*  */}
          <div className='flex justify-between'>
            <p>{ toUser?.displayName }</p>
            { latestMessage && (
              <p>{ formatTimeAgo(latestMessage?.createdAt) }</p>
            )}
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
    </div>
  )
}

export default PrivateChat