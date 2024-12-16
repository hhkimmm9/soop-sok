'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, firestore } from '@/utils/firebase/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import useDialogs from '@/utils/dispatcher';

import User from '@/app/(pages)/chats/[type]/[id]/user-list/User';

type pageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: pageProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);

  const router = useRouter();

  const { messageDialog } = useDialogs();

  // Authenticate a user
  useEffect(() => {
    if (!auth) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const chatRef = doc(firestore, 'chats', params.id);
  const [FSValue, FSLoading, FSError] = useDocument(
    isAuthenticated ? chatRef : null
  );

  // Handling retrieved data
  useEffect(() => {
    if (FSValue && FSValue.exists()) {
      setUsers(FSValue.data().members);
    }
  }, [FSValue]);

  // Error handling
  useEffect(() => {
    if (FSError !== undefined) {
      messageDialog.show('data_retrieval');

      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  }, [router, FSError, params.type, params.id, messageDialog]);

  const redirectToFeaturesPage = () => {
    if (auth) {
      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  };

  return (
    <div className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto rounded-lg shadow-sm bg-white
        flex flex-col gap-4
      '>
        <h1 className='font-semibold capitalize text-center text-2xl text-earth-600'>Users in this channel</h1>
        
        <ul className='flex flex-col gap-3'>
          { users.map((user: any) => (
            <User key={user} uid={user} />
          )) }
        </ul>
      </div>

      <button type="button" onClick={redirectToFeaturesPage} className='
        w-full py-4 rounded-lg shadow bg-white
        font-semibold text-xl text-earth-400
        transition duration-300 ease-in-out hover:bg-earth-50
      '> Cancel </button>
    </div>
  )
};

export default Page;