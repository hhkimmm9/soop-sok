'use client';

import ChatMessage from '@/components/chat-window/ChatMessage';
import MessageInput from '@/components/chat-window/MessageInput';

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, query,
  where, orderBy, limit,
} from 'firebase/firestore';

import { TMessage, FirestoreTimestamp } from '@/types';

import {
  Bars3Icon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

type MessageContainerProps = {
  type: string,
  cid: string
};

const NUM_MESSAGES_PER_FETCH = 10;

const MessageContainer = ({ type, cid }: MessageContainerProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [prevMessages, setPrevMessages] = useState<TMessage[]>([]);
  const [firstVisible, setFirstVisible] = useState<FirestoreTimestamp | null>(null);
  const [isAll, setIsAll] = useState(false);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { dispatch } = useAppState();

  // Authenticate a user
  useEffect(() => {
    if (!auth) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // 1. Fetch messages associated with the channel ID in real time.
  const messagesRef = collection(db, 'messages');
  const messagesQuery = query(messagesRef,
    where('cid', '==', cid),
    orderBy('createdAt', 'desc'),
    limit(NUM_MESSAGES_PER_FETCH)
  );
  const [FSSnapshot, FSLoading, FSError] = useCollection(
    isAuthenticated ? messagesQuery : null
  );

  // 2. Once messages are fetched, store them into the state.
  useEffect(() => {
    const messageList: TMessage[] = []; 

    if (FSSnapshot && !FSSnapshot.empty) {
      FSSnapshot.forEach((doc) => {
        messageList.push(doc.data() as TMessage);
      });

      const reversedMessageList = messageList.reverse();
      // store the first data for pagination.
      setFirstVisible(reversedMessageList[0].createdAt);
      setMessages(reversedMessageList);

      // scroll down to the bottom in case the total length of messages is longer than the window.
      setTimeout(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTo(0, chatWindowRef.current.scrollHeight);
        }
      }, 300);
    }
  }, [FSSnapshot]);

  // Error handling
  useEffect(() => {
    if (FSError !== undefined) {
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });

      router.refresh();
    }
  }, [router, FSError, dispatch]);

  // useEffect(() => {
  //   const messageList: TMessage[] = []; 

  //   // 1. Fetch messages associated with the channel ID in real time.
  //   const unsub = onSnapshot(query(collection(db, 'messages'),
  //     where('chatId', '==', cid),
  //     orderBy('createdAt', 'desc'),
  //     limit(NUM_MESSAGES_PER_FETCH)
  //   ), (docs) => {
  //     // 2. Once messages are fetched, store them into the state.
  //     if (!docs.empty) {
  //       docs.forEach((doc) => {
  //         messageList.push({
  //           id: doc.id,
  //           ...doc.data()
  //         } as TMessage);
  //       });
  //       setMessages(messageList.reverse());

  //       // TODO: scroll down to the bottom in case the total length of messages is longer than the window.

  //       // TODO: store the last data for pagination.
  //       // setLastVisible(messagesSnapshot.docs[messagesSnapshot.docs.length-1])
  //     }
  //   })

  //   return () => {
  //     unsub();
  //   }
  // }, [cid]);

  // ----------------------------------------------------------------
  
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

  const redirectToFeaturesPage = () => {
    router.push(`/chats/${type}/${cid}/features`);
  };

  const leavePrivateChat = () => {
    // if (auth) dispatch({ type: 'LEAVE_PRIVATE_CHAT' });
    router.push(`/private-chats/${auth.currentUser?.uid}`);
  };

  return (<>
    <div ref={chatWindowRef} onScroll={handleScroll}
      className='
        grow p-4 rounded-lg overflow-y-auto shadow-sm bg-white
        flex flex-col gap-5
    '>
      { prevMessages.map((message: TMessage) => (
        <ChatMessage key={message.createdAt.toString()} message={message} />
      ))}
      { messages.map((message: TMessage) => (
        <ChatMessage key={message.createdAt.toString()} message={message} />
      ))}
    </div>

    {/* features and message input box */}
    <div className='flex justify-between gap-3'>
      <div className='p-2 shadow-sm rounded-lg bg-white flex items-center'>
        { (type === 'channel' || type === 'chatroom') ? (
          // for channel chats & room chats
          <div onClick={redirectToFeaturesPage}>
            <Bars3Icon className='h-5 w-5' />
          </div>
        ) : (
          // for private chats
          <div onClick={leavePrivateChat}>
            <ArrowLeftIcon className='h-5 w-5' />
          </div>
        )}
      </div>
      <div className='grow'>
        <MessageInput cid={cid} />
      </div>
    </div>
  </>);
};

export default MessageContainer;