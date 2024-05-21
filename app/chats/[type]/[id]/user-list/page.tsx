'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import { Avatar, } from '@mui/material';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, } from 'firebase/firestore';

type pageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: pageProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);

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

  const boardRef = collection(db, 'status_board');
  const boardQuery = query(boardRef,
    where('cid', '==', params.id)
  );
  const [FSSnapshot, FSLoading, FSError] = useCollection(
    isAuthenticated ? boardQuery : null
  );

  // Handling retrieved data
  useEffect(() => {
    const activeUserContainer: any = [];
    if (FSSnapshot && !FSSnapshot.empty) {
      FSSnapshot.forEach((doc) => {
        activeUserContainer.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setActiveUsers(activeUserContainer)
    }
    setIsLoading(false);
  }, [FSSnapshot]);

  // Error handling
  useEffect(() => {
    if (FSError !== undefined) {
      dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });

      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  }, [router, FSError, dispatch, params.type, params.id]);

  // Local functions
  const redirectToProfile = (uid: string) => {
    if (auth) {
      router.push(`/profile/${uid}`);
    }
  };

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
          {/* TODO: Refactor: displayName and profilePicUrl is stored in status_board only because of this. */}
          { activeUsers.map((activeUser: any) => (
            <li key={activeUser.id}
              onClick={() => redirectToProfile(activeUser.uid)} className='
              p-3 rounded-lg shadow-sm bg-stone-200
              flex items-center justify-between
            '>
              <div className='flex items-center gap-3'>
                {/* <Avatar src={activeUser.profilePicUrl} alt='Profile Picture' sx={{ width: 52, height: 52 }} /> */}
                <Image src={activeUser.profilePicUrl} alt='Profile Picture'
                  width={52} height={52} className='object-cover'
                />
                <p>{ activeUser.displayName }</p>
              </div>
            </li>
          )) }
        </ul>
      </div>

      <button type='button' onClick={redirectToFeatures} className='
        w-full py-4 rounded-lg shadow-sm bg-white
        transition duration-300 ease-in-out hover:bg-stone-200
      '> Cancel </button>
    </div>
  )
};

export default Page;