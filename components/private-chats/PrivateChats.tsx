'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, doc,
  query, or, where,
  getDoc, getDocs
} from 'firebase/firestore';

import SearchBar from '@/components/SearchBar';
import PrivateChatWindow from '@/components/private-chats/PrivateChatWindow';
import PrivateChat from '@/components/private-chats/PrivateChat';

import { TUser, TPrivateChat } from '@/types';

const PrivateChats = () => {
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>();

  const { state, dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);

  const [realtime_chats, loading, error] = useCollection(
    query(collection(db, 'private_chats'),
      or(
        where('from', '==', signedInUser?.uid),
        where('to', '==', signedInUser?.uid),
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

  return (
    <>
      { state.activatePrivateChat ? (
        <PrivateChatWindow />
      ) : (
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
      )}
    </>
  );
};

export default PrivateChats;