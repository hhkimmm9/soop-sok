'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import Channel from '@/app/(public-chat)/channels/Channel';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/db/firebase';
import { fetchChannels } from '@/db/utils';

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

  useEffect(() => {
    const getChannels = async () => {
      try {
        const channels = await fetchChannels();
        setChannels(channels);
      } catch (err) {
        console.error(err);
        // TODO: merge these two dispatches
        dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
        router.refresh();
      }
    };
    if (isAuthenticated) {
      getChannels();
    }
  }, [router, isAuthenticated, dispatch]);

  // if (!isAuthenticated || FSLoading) return (
  if (!isAuthenticated) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (<>
    <div className='h-full bg-stone-100'>
      <div className='flex flex-col gap-3'>
        { channels && channels.length > 0 && channels.map(channel => (
          <Channel key={channel.id} channel={channel} />  
        )) }
      </div>
    </div>
  </>);
};

export default Page;