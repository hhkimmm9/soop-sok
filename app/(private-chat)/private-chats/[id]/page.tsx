'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import SearchBar from '@/components/SearchBar';
import PrivateChat from '@/app/(private-chat)/private-chats/[id]/PrivateChat';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, or, where, } from 'firebase/firestore';

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

  const { state, dispatch } = useAppState();

  // Authenticate a user
  useEffect(() => {
    if (!auth) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch data if a user is authenticated
  const chatsRef = collection(db, 'private_chats');
  const chatsQuery = query(chatsRef, or(
    where('from', '==', params.id),
    where('to', '==', params.id)
  ));
  const [FSSnapshot, FSLoading, FSError] = useCollection(
    isAuthenticated ? chatsQuery : null
  );

  // Handling retrieved data
  useEffect(() => {
    const container: TPrivateChat[] = []
    if (FSSnapshot && !FSSnapshot.empty) {
      FSSnapshot.forEach((doc) => {
        container.push({
          id: doc.id,
          ...doc.data()
        } as TPrivateChat)
      });
      setPrivateChats(container);
    }
  }, [FSSnapshot]);

  // Error handling
  useEffect(() => {
    if (FSError !== undefined) {
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });
      router.refresh();
    }
  }, [router, FSError, dispatch]);

  if (!isAuthenticated || FSLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )

  if (privateChats) return (<>
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
  </>);
};

export default Page;