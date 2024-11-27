'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth } from '@/utils/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import useDialog from "@/utils/dispatcher"

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

  const { messageDialog } = useDialog();

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

  }, [router]);

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