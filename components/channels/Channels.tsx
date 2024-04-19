'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy } from 'firebase/firestore';

import ChannelChatWindow from '@/components/channels/ChannelChatWindow';
import RoomChatWindow from '@/components/channels/RoomChatWindow';
import Channel from '@/components/channels/Channel';

import { TChannel } from '@/types';

const InChannel = () => {
  const [channels, setChannels] = useState<TChannel[]>([]);
  
  const { state } = useAppState();

  const [channelsSnapshot, loading, error] = useCollection(
    query(collection(db, 'channels'),
      orderBy('orderId', 'asc')
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const channels: TChannel[] = [];
    if (channelsSnapshot && !channelsSnapshot.empty) {
      channelsSnapshot.forEach((doc) => {
        channels.push({
          id: doc.id,
          ...doc.data()
        } as TChannel);
      });
      setChannels(channels);
    }
  }, [channelsSnapshot])

  if (state.activateChannelChat) return (
    <ChannelChatWindow cid={state.channelId} />
  )

  else if (state.activateChatChat) return (
    <RoomChatWindow cid={state.chatId} />
  )
  
  else return (
    <div className='flex flex-col gap-2'>
      { channels.map(channel => (
        <Channel key={channel.id} channelData={channel} />  
      )) }
    </div>
  )
};

export default InChannel;