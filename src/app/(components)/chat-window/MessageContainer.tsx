'use client';

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';
import { useCollection } from 'react-firebase-hooks/firestore';

import { auth, firestore } from '@/utils/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection } from 'firebase/firestore';

import ChatMessage from '@/app/(components)/chat-window/ChatMessage';

import { TMessage } from '@/types';

type MessageContainerProps = {
  type: string,
  cid: string
};

const NUM_MESSAGES_PER_FETCH = 10;

const MessageContainer = ({ cid }: MessageContainerProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([]);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  
  // check rules in Cloud Firestore for security concerns.
  const [value, loading, error] = useCollection(collection(firestore, "messages"),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );

  // If it's an authenticated user, fetch messages.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    });

    if (isAuthenticated && value) {
      const messageList = value.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as TMessage));

      setMessages(messageList);
    }

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    }
  }, [isAuthenticated, value, router]);

  useEffect(() => {
    if (loading) {
      console.log('Loading messages...');
    }

    if (error) {
      console.error('Error fetching messages:', error);
    }
  }, [loading, error]);
  
  return (
    <div ref={chatWindowRef} onScroll={() => {}}
      className='grow p-4 flex flex-col gap-5 rounded-lg shadow-sm overflow-y-auto bg-white 
    '>
      { messages.map((message: TMessage) => (
        <ChatMessage key={message.id} message={message} />
      )) }
    </div>
  );
};

export default MessageContainer;