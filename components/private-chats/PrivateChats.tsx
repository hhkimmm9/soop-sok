'use client';

import SearchBar from '@/components/SearchBar';
import PrivateChatWindow from '@/components/private-chats/PrivateChatWindow';
import PrivateChat from '@/components/private-chats/PrivateChat';

import { useState, useEffect } from 'react';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, doc,
  query, or, where,
  getDoc, getDocs
} from 'firebase/firestore';

import { TUser, TPrivateChat } from '@/types';

const PrivateChats = () => {
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>();

  const { state, dispatch } = useAppState();

  const [realtime_chats] = useCollection(
    query(collection(db, 'private_chats'),
      or(
        where('from', '==', auth.currentUser?.uid),
        where('to', '==', auth.currentUser?.uid),
      )
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const messageContainer: TPrivateChat[] = []
    if (realtime_chats && !realtime_chats.empty) {
      realtime_chats.forEach((doc) => {
        messageContainer.push({
          id: doc.id,
          ...doc.data()
        } as TPrivateChat)
      });
      setPrivateChats(messageContainer);
    }
  }, [realtime_chats]);

  const renderComponent = () => {
    if (state.activatePrivateChat)
      return <PrivateChatWindow />;

    else return (
      <div className='flex flex-col gap-6'>
        {/* interaction area */}
        <SearchBar
          goBack={() => {}}
          onSubmit={(searchQuery: string) => console.log(searchQuery) }
        />

        {/* private chats */}
        <div className='flex flex-col gap-2'>
          { privateChats?.map((privateChat: TPrivateChat) => (
            <PrivateChat key={privateChat.id} privateChat={privateChat} />
          ))}
        </div>
      </div>
    );
  };

  return renderComponent();
};

export default PrivateChats;