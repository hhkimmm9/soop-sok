import ChatMessage from '@/components/chat-window/ChatMessage';
import MessageInput from '@/components/chat-window/MessageInput';

import { useState, useEffect, useRef } from 'react'

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, onSnapshot, doc, query,
  where, orderBy, startAt, startAfter, limit,
  getDoc, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore';

import { TMessage, FirestoreTimestamp } from '@/types';

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
  const [firstVisible, setFirstVisible] = useState<FirestoreTimestamp | null>(null);
  const [isAll, setIsAll] = useState(false);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  const { state, dispatch } = useAppState();

  // 1. Fetch messages associated with the channel ID in real time.
  const [messagesSnapshot] = useCollection(
    query(collection(db, 'messages'),
      where('chatId', '==', cid),
      orderBy('createdAt', 'desc'),
      limit(NUM_MESSAGES_PER_FETCH)
    ), {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );

  // 2. Once messages are fetched, store them into the state.
  useEffect(() => {
    const messageList: TMessage[] = []; 

    if (messagesSnapshot && !messagesSnapshot.empty) {
      messagesSnapshot.forEach((doc) => {
        messageList.push({
          id: doc.id,
          ...doc.data()
        } as TMessage);
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
  }, [messagesSnapshot]);

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
  
  const lazyLoadMessages = async () => {
    const prevMessageList: TMessage[] = [];
    const q = query(collection(db, 'messages'),
      where('chatId', '==', cid),
      orderBy('createdAt', 'desc'),
      startAfter(firstVisible),
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
      
      const reversedMessageList = prevMessageList.reverse();
      
      // update the first visible value for pagination.
      setFirstVisible(reversedMessageList[0].createdAt);
      setPrevMessages((prev) => [ ...reversedMessageList, ...prev ]);
    } else setIsAll(true);
  };

  // When the scroll hits the top of the window, lazy load previous messages.
  const handleScroll = async () => {
    const scrollContainer = chatWindowRef.current;

    if (scrollContainer?.scrollTop === 0 && !isAll) {
      await lazyLoadMessages();

      // TODO: scroll down to the bottom.
      setTimeout(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTo(0, chatWindowRef.current.clientHeight);
        }
      }, 300);
    }
  };

  const redirectToFeaturesPage = () => {
    if (auth) dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features' });
  };

  const leavePrivateChat = () => {
    if (auth) dispatch({ type: 'LEAVE_PRIVATE_CHAT' });
  };

  return (
    <>
      <div ref={chatWindowRef} onScroll={handleScroll}
        className='
          grow p-4 rounded-lg overflow-y-auto shadow-sm bg-white
          flex flex-col gap-5
      '>
        { prevMessages.map((message: TMessage) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        { messages.map((message: TMessage) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      {/* features and message input box */}
      <div className='flex justify-between gap-3'>
        <div className='p-2 shadow-sm rounded-lg bg-white flex items-center'>
          { state.currentPage === 'channel' ? (
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
    </>  
  )
};

export default MessageContainer;