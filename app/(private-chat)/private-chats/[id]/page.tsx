"use client";

import SearchBar from '@/components/SearchBar';
import PrivateChat from '@/app/(private-chat)/private-chats/[id]/PrivateChat';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, or, where, } from 'firebase/firestore';

import { TPrivateChat } from '@/types';

type PrivateChatProps = {
  params: {
    id: string,
  }
};

const Page = ({ params }: PrivateChatProps) => {
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>();

  const router = useRouter();

  const [collectionSnapshot, loading, error] = useCollection(
    query(collection(db, 'private_chats'),
      or(
        where('from', '==', params.id),
        where('to', '==', params.id)
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
  }, [router]);

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

  return (
    <div className='h-full bg-stone-100'>
      <div className='flex flex-col gap-6'>
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

export default Page;