'use client';

import Channel from '@/app/(public-chat)/channels/Channel';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';

import { TChannel } from '@/types';

const Page = () => {
  const [channels, setChannels] = useState<TChannel[]>([]);
  
  const router = useRouter();

  /* 2. The effect of useCollection is triggered whenever the collection changes
    or when the component mounts. */
  const [collectionSnapshot, loading, error] = useCollection(
    query(collection(db, 'channels'),
      orderBy('order', 'asc')
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  /* 1. When the component mounts for the first time, the first useEffect hook
    runs due to the empty dependency array. */
  useEffect(() => {
    if (!auth) {
      router.push('/');
      return;
    }
  }, [router]);

  /* 3. Once the collectionSnapshot is updated with the data from Firestore,
    the second useEffect hook updates the state with the retrieved channels. */
  useEffect(() => {
    const container: TChannel[] = [];
    if (collectionSnapshot && !collectionSnapshot.empty) {
      collectionSnapshot.forEach((doc) => {
        container.push({
          id: doc.id,
          ...doc.data()
        } as TChannel);
      });
      setChannels(container);
    }
  }, [collectionSnapshot]);

  return (
    <>
      <div className='h-full bg-stone-100'>
        <div className='flex flex-col gap-3'>
          { channels.map(channel => (
            <Channel key={channel.id} channel={channel} />  
          )) }
        </div>
      </div>
    </>
  );
};

export default Page;