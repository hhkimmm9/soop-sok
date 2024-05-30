'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import SearchBar from '@/components/SearchBar';
import Chat from '@/app/chats/[type]/[id]/chat-list/Chat';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, query,
  where, orderBy,
} from 'firebase/firestore'

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

  const { dispatch } = useAppState();

  // Authenticate a user
  useEffect(() => {
    if (!auth) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch data if a user is authenticated
  const chatsRef = collection(db, 'chats');
  const chatsQuery = query(chatsRef,
    where('cid', '==', params.id),
    orderBy('createdAt', 'asc')
  );
  const [FSSnapshot, FSLoading, FSError] = useCollection(
    isAuthenticated ? chatsQuery : null
  );

  // Handling retrieved data
  useEffect(() => {
    const chatList: TChat[] = [];
    if (FSSnapshot && !FSSnapshot.empty) {
      FSSnapshot.forEach((doc) => {
        chatList.push({
          id: doc.id,
          ...doc.data()
        } as TChat);
      });
      setChats(chatList);
    }
  }, [FSSnapshot])

  // Error handling
  useEffect(() => {
    if (FSError !== undefined) {
      dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });

      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  }, [router, FSError, dispatch, params.type, params.id]);

  // Local functions
  const redirectToFeaturesPage = () => {
    if (auth) {
      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  };

  if (!isAuthenticated || FSLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (
    <div className='h-full flex flex-col gap-4'>
      <SearchBar
        onSubmit={(searchQuery: string) => console.log(searchQuery) }
      />

      {/* chat list */}
      <div className='
        row-span-11 grow p-4 overflow-y-auto rounded-lg bg-white
        flex flex-col gap-3
      '>
        { chats.map((chat: TChat) => (
          <Chat key={chat.id} chat={chat} />
        )) }
      </div>

      <button type='button' onClick={redirectToFeaturesPage} className='
        w-full py-4 rounded-lg shadow-sm bg-white
        transition duration-300 ease-in-out hover:bg-stone-200
      '> Cancel </button>
    </div>
  )
};

export default Page;