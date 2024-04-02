'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, query,
  where, orderBy,
} from 'firebase/firestore'
import SearchBar from '@/components/SearchBar';
import SortOptions from '@/components/SortOptions';
import Chat from '@/components/chat-window/Chat';
import { TChat } from '@/types'

const ChatList = () => {
  const [chats, setChats] = useState<TChat[]>([]);
  const [activateSearch, setActivateSearch] = useState(false);
  const [activateSort, setActivateSort] = useState(false);
  
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

  return (
    <div className='h-full flex flex-col gap-4'>
      {/* { !activateSearch && !activateSort && (
        <div className='grid grid-cols-2 gap-2'>
          <button onClick={() => setActivateSearch(true)}
            className='bg-white border border-black py-2 rounded-lg shadow-sm
          '>Search</button>
          <button onClick={() => setActivateSort(true)}
            className='bg-white border border-black py-2 rounded-lg shadow-sm
          '>Sort</button>
        </div>
      )}

      { activateSearch && (
        <SearchBar
          goBack={() => setActivateSearch(false) }
          onSubmit={(searchQuery: string) => console.log(searchQuery) }
        />
      )}

      { activateSort && (
        <SortOptions
          goBack={() => setActivateSort(false)}
          options={['Option A', 'Option B']}
          onSelect={(selectedValue: string) => console.log(selectedValue) }
        />
      )} */}

      {/* chat list */}
      <div className='
        grow row-span-11 p-4 overflow-y-auto
        border border-black rounded-lg bg-white
        flex flex-col gap-3
      '>
        { chats.map((chat: TChat) => (
          <Chat key={chat.id} chat={chat} />
        )) }
      </div>

      <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features' })}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Cancel</div>
    </div>
  )
}

export default ChatList