'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import Channel from '@/app/(public-chat)/channels/Channel';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';

import { TChannel } from '@/types';

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [channels, setChannels] = useState<TChannel[]>([]);
  
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
  const channelsRef = collection(db, 'channels');
  const channelsQuery = query(channelsRef, orderBy('order', 'asc'));
  const [FSSnapshot, FSLoading, FSError] = useCollection(
    isAuthenticated ? channelsQuery : null
  );

  // Handling retrieved data
  useEffect(() => {
    const container: TChannel[] = [];
    if (FSSnapshot && !FSSnapshot.empty) {
      FSSnapshot.forEach((doc) => {
        container.push({
          id: doc.id,
          ...doc.data()
        } as TChannel);
      });
      setChannels(container);
    }
  }, [FSSnapshot]);

  // Error handling
  useEffect(() => {
    if (FSError !== undefined) {
      dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
    }

    router.refresh();
  }, [router, FSError, dispatch]);

  if (!isAuthenticated || FSLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (<>
    <div className='h-full bg-stone-100'>
      <div className='flex flex-col gap-3'>
        { channels.map(channel => (
          <Channel key={channel.id} channel={channel} />  
        )) }
      </div>
    </div>
  </>);
};

export default Page;