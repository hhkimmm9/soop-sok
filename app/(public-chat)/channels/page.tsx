'use client';

import Channel from '@/app/(public-chat)/channels/Channel';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import useDialogs from '@/functions/dispatcher'; // Adjust the import path as necessary
import { auth } from '@/db/firebase';
import { fetchChannels } from '@/db/services';

import { TChannel } from '@/types';

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [channels, setChannels] = useState<TChannel[]>([]);
  
  const router = useRouter();
  const { messageDialog } = useDialogs();

  // Authenticate a user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const getChannels = async () => {
      try {
        const channels = await fetchChannels();
        setChannels(channels);
      } catch (err) {
        console.error(err);
        messageDialog.show('data_retrieval');
      }
    };
    
    if (isAuthenticated) {
      getChannels();
    }
  }, [router, isAuthenticated, messageDialog]);

  return (
    <div>
      <h1 className='my-8 font-semibold text-3xl text-center text-earth-600'>Channels</h1>
      <div className='h-full overflow-y-auto flex flex-col gap-3'>
        {channels && channels.length > 0 && channels.map(channel => (
          <Channel key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
};

export default Page;