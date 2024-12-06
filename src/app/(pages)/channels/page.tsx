'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import PageTitle from '@/app/(components)/PageTitle';
import Channel from '@/app/(pages)/channels/Channel';

import { TChannel } from '@/types';
import { auth } from '@/utils/firebase/firebase';
import { fetchChannels } from '@/utils/firebase/firestore/services';
import useDialogs from '@/utils/dispatcher'; // Adjust the import path as necessary

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
    <>
      <PageTitle title="Channels" />
      <div className='h-full overflow-y-auto flex flex-col gap-3'>
        {channels && channels.length > 0 && channels.map(channel => (
          <Channel key={channel.id} channel={channel} />
        ))}
      </div>
    </>
  );
};

export default Page;