'use client';

import SearchBar from '@/app/(components)/SearchBar';
import PrivateChat from '@/app/(pages)/private-chats/[id]/PrivateChat';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth } from '@/utils/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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

  // Authenticate a user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    }
  }, [isAuthenticated, router]);

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