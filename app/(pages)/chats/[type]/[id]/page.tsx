'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, query,
  where, orderBy,
} from 'firebase/firestore';

import ChatMessage from '@/app/components/ChatMessage';
import MessageInput from '@/app/(pages)/chats/(components)/MessageInput';

import { TMessage } from '@/app/types';

const Chat = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [activateUserInput, setActivateUserInput] = useState(false);

  const params = useParams();

  const [realtime_messages, loading, error] = useCollection(
    query(collection(db, 'messages'),
      where('chatId', '==', params.id),
      orderBy('createdAt', 'asc')
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const messageList: TMessage[] = []; 
    if (realtime_messages && !realtime_messages.empty) {
      realtime_messages.forEach((doc) => {
        messageList.push({
          id: doc.id,
          ...doc.data()
        } as TMessage);
      });
      setMessages(messageList);
    }
  }, [realtime_messages]);

  return (
    <div className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto
        border border-black rounded-lg bg-white
        flex flex-col gap-5
      '>
        { messages.map((message: TMessage) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className=''>
        { activateUserInput || params.type === 'dm' ? (
          <div className=''>
            <MessageInput cancel={() => setActivateUserInput(false)} />
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-2'>
            <button onClick={() => setActivateUserInput(true)}
              className='bg-white border border-black py-2 rounded-lg shadow-sm
            '>Send a message</button>
            <Link href={`/chats/${params.type}/${params.id}/features`}
              className='bg-white border border-black py-2 rounded-lg shadow-sm text-center
            '>Other features</Link>
          </div>
        )}
      </div>
    </div>
  )
};

export default Chat;