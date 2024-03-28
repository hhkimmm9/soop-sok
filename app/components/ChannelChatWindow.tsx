import { useState, useEffect } from 'react';
import { useAppState } from '@/app/utils/AppStateProvider';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, query,
  where, orderBy,
} from 'firebase/firestore';

import Banner from '@/app/components/Banner';
import ChatMessage from '@/app/components/ChatMessage';
import MessageInput from '@/app/components/ChatWindow/MessageInput';
import Features from '@/app/components/ChatWindow/Features';

import { TMessage } from '@/app/types';
import {
  Bars3Icon,
} from '@heroicons/react/24/outline';

type ChatWindowProps = {
  chatId: string;
};

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<TMessage[]>([]);

  const { state, dispatch } = useAppState();

  const [realtime_messages] = useCollection(
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
    <div className='h-full grid grid-rows-12'>
      <Banner />
      <div className='row-start-2 row-span-11'>
        <div className='h-full flex flex-col gap-4'>
          { state.channelComponent === 'lobby' && (
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

              <div className='flex justify-between gap-3'>
                <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features'})}
                  className='flex items-center border border-black p-2 rounded-lg bg-white'
                >
                  <Bars3Icon className='h-5 w-5' />
                </div>
                <div className='grow'>
                  <MessageInput chatId={chatId} />
                </div>
              </div>
            </>  
          )}

          { state.channelComponent === 'features' && (
            <Features />
          ) }
        </div>
      </div>
    </div>
    
  )
};

export default ChatWindow;