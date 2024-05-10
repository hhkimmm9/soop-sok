'use client';

import SearchBar from '@/components/SearchBar';
import Chat from '@/components/chat-window/features/Chat';

import { useState, useEffect } from 'react';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, query,
  where, orderBy,
} from 'firebase/firestore'

import { TChat } from '@/types'

const ChatList = () => {
  const [chats, setChats] = useState<TChat[]>([]);
  
  const { state, dispatch } = useAppState();

  const [realtime_chats, loading, error] = useCollection(
    query(collection(db, 'chats'),
      where('channelId', '==', state.channelId),
      orderBy('createdAt', 'asc')
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const chatList: TChat[] = [];
    if (realtime_chats && !realtime_chats.empty) {
      realtime_chats.forEach((doc) => {
        chatList.push({
          id: doc.id,
          ...doc.data()
        } as TChat);
      });
      setChats(chatList);
    }
  }, [realtime_chats])

  const redirectToFeaturesPage = () => {
    dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features' });
  };

  return (
    <div className='h-full flex flex-col gap-4'>
      <SearchBar
        onSubmit={(searchQuery: string) => console.log(searchQuery) }
      />

      {/* chat list */}
      <div className='
        row-span-11 grow p-4 overflow-y-auto rounded-lg bg-white
        flex flex-col gap-3
      '>
        { chats.map((chat: TChat) => (
          <Chat key={chat.id} chat={chat} />
        )) }
      </div>

      <button type="button" onClick={redirectToFeaturesPage} className='
        w-full py-4 rounded-lg shadow-sm bg-white
        transition duration-300 ease-in-out hover:bg-stone-200
      '> Cancel </button>
    </div>
  )
}

export default ChatList