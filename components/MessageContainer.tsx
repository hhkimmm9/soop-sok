import { useState, useEffect, useRef } from 'react'
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, doc, query,
  where, orderBy, startAt, startAfter, limit,
  getDoc, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore';

import ChatMessage from '@/components/chat-window/ChatMessage';
import MessageInput from '@/components/chat-window/MessageInput';

import { TMessage } from '@/types';

import {
  Bars3Icon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

type MessageContainerProps = {
  cid: string,
};

const NUM_MESSAGES_PER_FETCH = 10;

const MessageContainer = ({ cid }: MessageContainerProps) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [prevMessages, setPrevMessages] = useState<TMessage[]>([]);
  const [lastVisible, setLastVisible] = useState([]);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  const { state, dispatch } = useAppState();

  // 2. Fetch messages associated with the channel ID in real time.
  const [messagesSnapshot] = useCollection(
    query(collection(db, 'messages'),
      where('chatId', '==', cid),
      orderBy('createdAt', 'desc'),
      limit(NUM_MESSAGES_PER_FETCH)
    ), {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );

  // 3. Once messages are fetched, store them into the state.
  useEffect(() => {
    const messageList: TMessage[] = []; 
    if (messagesSnapshot && !messagesSnapshot.empty) {
      messagesSnapshot.forEach((doc) => {
        messageList.push({
          id: doc.id,
          ...doc.data()
        } as TMessage);
      });
      setMessages(messageList.reverse());

      // TODO: scroll down to the bottom in case the total length of messages is longer than the window.

      // TODO: store the last data for pagination.
      // setLastVisible(messagesSnapshot.docs[messagesSnapshot.docs.length-1])
    }
  }, [messagesSnapshot]);

  // 1. When the scroll hits the top of the window, lazy load previous messages.
  const handleScroll = () => {
    const scrollContainer = chatWindowRef.current;

    if (scrollContainer?.scrollTop === 0) {
      lazyLoadMessages();

      // TODO: scroll down to the bottom.
    }
  };

  // 2. The lazy load function for fetching previous messages.
  const lazyLoadMessages = async () => {
    const prevMessageList: TMessage[] = [];
    const q = query(collection(db, 'messages'),
      where('chatId', '==', cid),
      orderBy('createdAt', 'desc'),
      startAt(lastVisible),
      limit(NUM_MESSAGES_PER_FETCH)
    );
    const prevMessagesSnapshot = await getDocs(q);

    if (!prevMessagesSnapshot.empty) {
      prevMessagesSnapshot.forEach((doc) => {
        prevMessageList.push({
          id: doc.id,
          ...doc.data()
        } as TMessage);
      });
      setPrevMessages(prevMessageList.reverse());
      console.log(prevMessages);
    }
  };

  return (
    <>
      {/* message container */}
      <div
        ref={chatWindowRef}
        onScroll={handleScroll}
        className='
          grow p-4 overflow-y-auto
          border border-black rounded-lg bg-white
          flex flex-col gap-5
      '>
        { messages.map((message: TMessage) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      {/* features and message input box */}
      <div className='flex justify-between gap-3'>
        <div className='flex items-center border border-black p-2 rounded-lg bg-white'>
          { state.currentPage === 'channel' ? (
            <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features' })}>
              <Bars3Icon className='h-5 w-5' />
            </div>
          ) : (
            <div onClick={() => dispatch({ type: 'LEAVE_PRIVATE_CHAT' })}>
              <ArrowLeftIcon className='h-5 w-5' />
            </div>
          )}
        </div>
        <div className='grow'>
          <MessageInput cid={cid} />
        </div>
      </div>
    </>  
  )
}

export default MessageContainer