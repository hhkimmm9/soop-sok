'use client';

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/firebase/firebase';
import useDialog from "@/utils/dispatcher"

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

  const { messageDialog } = useDialog();

  // If it's an authenticated user, fetch messages.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    }
  }, [cid, isAuthenticated, router]);
  
  // Local functions
  const lazyLoadMessages = async () => {
    // const prevMessageList: TMessage[] = [];
    // const q = query(collection(db, 'messages'),
    //   where('cid', '==', cid),
    //   orderBy('createdAt', 'desc'),
    //   startAfter(firstVisible),
    //   limit(NUM_MESSAGES_PER_FETCH)
    // );
    // const prevMessagesSnapshot = await getDocs(q);

    // if (!prevMessagesSnapshot.empty) {
    //   prevMessagesSnapshot.forEach((doc) => {
    //     prevMessageList.push({
    //       id: doc.id,
    //       ...doc.data()
    //     } as TMessage);
    //   });
      
    //   const reversedMessageList = prevMessageList.reverse();
      
    //   // update the first visible value for pagination.
    //   setFirstVisible(reversedMessageList[0].createdAt);
    //   setPrevMessages((prev) => [ ...reversedMessageList, ...prev ]);
    // } else setIsAll(true);
  };

  // When the scroll hits the top of the window, lazy load previous messages.
  const handleScroll = async () => {
    // const scrollContainer = chatWindowRef.current;

    // if (scrollContainer?.scrollTop === 0 && !isAll) {
    //   await lazyLoadMessages();

    //   // TODO: scroll down to the bottom.
    //   setTimeout(() => {
    //     if (chatWindowRef.current) {
    //       chatWindowRef.current.scrollTo(0, chatWindowRef.current.clientHeight);
    //     }
    //   }, 300);
    // }
  };

  return (
    <div ref={chatWindowRef} onScroll={handleScroll}
      className='grow p-4 flex flex-col gap-5 rounded-lg shadow-sm overflow-y-auto bg-white 
    '>
      { messages.map((message: TMessage) => (
        <ChatMessage key={message.createdAt.toString()} message={message} />
      ))}
    </div>
  );
};

export default MessageContainer;