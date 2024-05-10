'use client';

import SearchBar from '@/components/SearchBar';
import PrivateChatWindow from '@/components/private-chats/PrivateChatWindow';
import PrivateChat from '@/components/private-chats/PrivateChat';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, or, where, } from 'firebase/firestore';

import { TPrivateChat } from '@/types';

const PrivateChats = () => {
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>();

  const { state, dispatch } = useAppState();

  const router = useRouter();

  const [collectionSnapshot, loading, error] = useCollection(
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
    if (!auth) {
      router.push('/');
      return;
    }
  }, [auth]);

  useEffect(() => {
    const container: TPrivateChat[] = []
    if (collectionSnapshot && !collectionSnapshot.empty) {
      collectionSnapshot.forEach((doc) => {
        container.push({
          id: doc.id,
          ...doc.data()
        } as TPrivateChat)
      });
      setPrivateChats(container);
    }
  }, [collectionSnapshot]);

  const renderComponent = () => {
    if (state.activatePrivateChat)
      return <PrivateChatWindow />;

    else return (
      <div className='h-full bg-stone-100'>
        <div className='p-4 flex flex-col gap-6'>
          {/* interaction area */}
          <SearchBar
            onSubmit={(searchQuery: string) => console.log(searchQuery) }
          />

          {/* private chats */}
          <div className='flex flex-col gap-2'>
            { privateChats?.map((privateChat: TPrivateChat) => (
              <PrivateChat key={privateChat.id} privateChat={privateChat} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return renderComponent();
};

export default PrivateChats;