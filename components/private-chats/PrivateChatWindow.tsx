import { useState, useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, query,
  where, orderBy,
} from 'firebase/firestore';

import ChatMessage from '@/components/chat-window/ChatMessage';
import MessageInput from '@/components/chat-window/MessageInput';

import { TMessage } from '@/types';
import {
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const ChatWindow = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);

  const { state, dispatch } = useAppState();

  const [realtime_messages, loading, error] = useCollection(
    query(collection(db, 'messages'),
      where('chatId', '==', state.privateChatId),
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

  const leavePrivateChat = () => {
    dispatch({ type: 'LEAVE_PRIVATE_CHAT' })
  };

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

      <div className='flex justify-between gap-3'>
        <div onClick={leavePrivateChat}
          className='flex items-center border border-black p-2 rounded-lg bg-white'
        >
          <ArrowLeftIcon className='h-5 w-5' />
        </div>
        <div className='grow'>
          <MessageInput chatId={state.privateChatId} />
        </div>
      </div>
    </div>
  )
};

export default ChatWindow;