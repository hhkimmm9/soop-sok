import { useState, useEffect } from 'react';
import { useAppState } from '@/app/utils/AppStateProvider';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, query,
  where, orderBy,
} from 'firebase/firestore';

import ChatMessage from '@/app/components/ChatMessage';
import MessageInput from '@/app/(pages)/chats/(components)/MessageInput';
import Features from '@/app/components/ChatWindow/Features';

import { TMessage } from '@/app/types';

type ChatWindowProps = {
  chatId: string;
};

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<TMessage[]>([]);

  const { state, dispatch } = useAppState();

  const [realtime_messages, loading, error] = useCollection(
    query(collection(db, 'messages'),
      where('chatId', '==', chatId),
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
      { state.privateChatComponent === 'chat_window' && (
        <>
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
            <MessageInput cancel={() => {}} />
          </div>
        </>  
      )}

      { state.privateChatComponent === 'features' && (
        <Features />
      ) }
    </div>
  )
};

export default ChatWindow;