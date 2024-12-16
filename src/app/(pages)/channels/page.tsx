'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import PageTitle from '@/app/_components/PageTitle';
import Channel from '@/app/(pages)/channels/Channel';

import { TChannel } from '@/types';
import { auth, firestore } from '@/utils/firebase/firebase';
import useDialogs from '@/utils/dispatcher'; // Adjust the import path as necessary

import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [channels, setChannels] = useState<TChannel[]>([]);
  
  const router = useRouter();
  const { messageDialog } = useDialogs();

  const channelsRef = collection(firestore, 'channels');
  const [snapshot, loading, error] = useCollection(channelsRef, {
    snapshotListenOptions: { includeMetadataChanges: true }
  });

  // TODO: custom hook
  // Authenticate a user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated || loading) return;
  
    if (error) {
      console.error(error);
      messageDialog.show('data_retrieval');
      return;
    }
  
    if (snapshot) {
      const channels: TChannel[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          capacity: data.capacity,
          members: data.members,
          name: data.name,
          numMembers: data.numMembers,
          order: data.order,
          updatedAt: data.updatedAt
        } as TChannel;
      });
      setChannels(channels);
    }
  }, [isAuthenticated, snapshot, loading, error, messageDialog]);

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