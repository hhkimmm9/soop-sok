'use client';

import User from '@/app/chats/[type]/[id]/user-list/User';
import ProgressIndicator from '@/components/ProgressIndicator';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';

type pageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: pageProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

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

  const chatRef = doc(db, 'chats', params.id);
  const [FSValue, FSLoading, FSError] = useDocument(
    isAuthenticated ? chatRef : null
  );

  // Handling retrieved data
  useEffect(() => {
    if (FSValue && FSValue.exists()) {
      setUsers(FSValue.data().members);
    }
    setIsLoading(false);
  }, [FSValue]);

  // Error handling
  useEffect(() => {
    if (FSError !== undefined) {
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });

      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  }, [router, FSError, dispatch, params.type, params.id]);

  const redirectToFeatures = () => {
    if (auth) {
      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  };

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (
    <div className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto rounded-lg shadow-sm bg-white
        flex flex-col gap-4
      '>
        <ul className='flex flex-col gap-3'>
          { users.map((user: any) => (
            <User key={user} uid={user} />
          )) }
        </ul>
      </div>

      <button type='button' onClick={redirectToFeatures}
        className='
          w-full py-4 rounded-lg shadow-sm bg-white
          transition duration-300 ease-in-out hover:bg-stone-200
      '> Cancel </button>
    </div>
  )
};

export default Page;