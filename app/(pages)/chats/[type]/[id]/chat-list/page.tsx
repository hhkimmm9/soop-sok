'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, query,
  where, orderBy,
} from 'firebase/firestore'
import SearchBar from '@/app/components/SearchBar';
import SortOptions from '@/app/components/SortOptions';
import Chat from '@/app/(pages)/chats/[type]/[id]/chat-list/(components)/Chat';
import { TChat } from '@/app/types'

const ChatListPage = () => {
  const [chats, setChats] = useState<TChat[]>([]);
  const [activateSearch, setActivateSearch] = useState(false);
  const [activateSort, setActivateSort] = useState(false);

  const params = useParams();

  const [realtime_chats, loading, error] = useCollection(
    query(collection(db, 'chats'),
      where('channelId', '==', params.id),
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

      <Link href={`/chats/${params.type}/${params.id}/features`}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Go Back</Link>
    </div>
  )
};

export default ChatListPage;