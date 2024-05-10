'use client';

import ChannelChatWindow from '@/components/public-chat/ChannelChatWindow';
import RoomChatWindow from '@/components/public-chat/RoomChatWindow';
import Channel from '@/components/public-chat/Channel';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';

import { TChannel } from '@/types';

const InChannel = () => {
  const [channels, setChannels] = useState<TChannel[]>([]);
  
  const router = useRouter();
  
  const { state } = useAppState();

  /* 2. The effect of useCollection is triggered whenever the collection changes
    or when the component mounts. */
  const [collectionSnapshot, loading, error] = useCollection(
    query(collection(db, 'channels'),
      orderBy('orderId', 'asc')
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
  }, [auth]);

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

  const renderComponent = () => {
    if (state.activateChannelChat) return (
      <ChannelChatWindow cid={state.channelId} />  
    );

    else if (state.activateRoomChat) return (
      <RoomChatWindow cid={state.chatId} />  
    );

    else return (
      <div className='h-full bg-stone-100'>
        <div className='p-4 flex flex-col gap-3'>
          { channels.map(channel => (
            <Channel key={channel.id} channel={channel} />  
          )) }
        </div>
      </div>
    );
  };

  return renderComponent();
};

export default InChannel;