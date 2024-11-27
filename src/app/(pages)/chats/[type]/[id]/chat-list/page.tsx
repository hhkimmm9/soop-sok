'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from 'react-firebase-hooks/firestore';

import { auth, firestore } from '@/utils/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection } from 'firebase/firestore';

import Chat from '@/app/(pages)/chats/[type]/[id]/chat-list/Chat';

import { TChat } from '@/types'

type pageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: pageProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<TChat[]>([]);

  const router = useRouter();

  const [value, loading, error] = useCollection(collection(firestore, "chats"),
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
      } as TChat));

      setChats(chatList);
    }

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    }

  }, [isAuthenticated, value, router]);

  useEffect(() => {
    if (loading) {
      console.log('Loading messages...');
    }

    if (error) {
      console.error('Error fetching messages:', error);
    }
  }, [loading, error]);

  // Local functions ----------------------------------------------------------
  const handleCancelClick = () => {
    if (auth) router.push(`/chats/${params.type}/${params.id}/features`);
  };

  return (
    <div className='h-full flex flex-col gap-4'>
      {/* chat list */}
      <div className='
        row-span-11 grow p-4 overflow-y-auto rounded-lg bg-white
        flex flex-col gap-6
      '>
        <h1 className='font-semibold capitalize text-center text-2xl text-earth-600'>Chats</h1>

        <div className='flex flex-col gap-3'>
          {chats.map((chat: TChat) => (
            <Chat key={chat.id} chat={chat} />
          ))}
        </div>
      </div>

      <button type="button" onClick={handleCancelClick} className='
        w-full py-4 rounded-lg shadow bg-white
        font-semibold text-xl text-earth-400
        transition duration-300 ease-in-out hover:bg-earth-50
      '> Cancel </button>
    </div>
  )
};

export default Page;