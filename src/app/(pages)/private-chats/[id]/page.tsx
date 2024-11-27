'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from 'react-firebase-hooks/firestore';

import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from '@/utils/firebase/firebase';
import { collection } from 'firebase/firestore';

import SearchBar from '@/app/(components)/SearchBar';
import PrivateChat from '@/app/(pages)/private-chats/[id]/PrivateChat';

import { TPrivateChat } from '@/types';

type PrivateChatProps = {
  params: {
    id: string,
  }
};

const Page = ({ params }: PrivateChatProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>([]);

  const router = useRouter();

  const [value, loading, error] = useCollection(collection(firestore, "private-chats"),
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  );

  // Authenticate a user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    });

    if (isAuthenticated && value) {
      const chatList = value.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as TPrivateChat));

      setPrivateChats(chatList);
    }

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (loading) {
      console.log('Loading messages...');
    }

    if (error) {
      console.error('Error fetching messages:', error);
    }
  }, [loading, error]);

  return (
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