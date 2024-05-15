'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import SearchBar from '@/components/SearchBar';
import PrivateChat from '@/app/(private-chat)/private-chats/[id]/PrivateChat';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const [isLoading, setIsLoading] = useState(true);
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>([]);

  const router = useRouter();

  const [collectionSnapshot] = useCollection(
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
    setIsLoading(false);
  }, [collectionSnapshot]);

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else if (!isLoading && privateChats) return (
    <div className='h-full bg-stone-100'>
      <div className='flex flex-col gap-6'>
        {/* interaction area */}
        <SearchBar
          onSubmit={(searchQuery: string) => console.log(searchQuery) }
        />

        {/* private chats */}
        <div className='flex flex-col gap-2'>
          { privateChats.length > 0 ? privateChats?.map((privateChat: TPrivateChat) => (
            <PrivateChat key={privateChat.id} privateChat={privateChat} />
          )) : (
            <p>You have no messages received. 📭</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;