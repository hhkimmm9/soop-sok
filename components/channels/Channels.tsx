'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

import ChannelChatWindow from '@/components/channels/ChannelChatWindow';
import ChatChatWindow from '@/components/channels/ChatChatWindow';
import Channel from '@/components/channels/Channel';

import { TChannel } from '@/types';

const InChannel = () => {
  const [channels, setChannels] = useState<TChannel[]>([]);
  
  const { state, dispatch } = useAppState();

  const [realtime_channels, loading, error] = useCollection(
    query(collection(db, 'channels'),
      orderBy('orderId', 'asc')
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const channels: TChannel[] = [];
    if (realtime_channels && !realtime_channels.empty) {
      realtime_channels.forEach((doc) => {
        channels.push({
          id: doc.id,
          ...doc.data()
        } as TChannel);
      });
      setChannels(channels);
    }
  }, [realtime_channels])

  if (state.activateChannelChat) {
    return (
      <>
        <ChannelChatWindow chatId={state.channelId} />
      </>
    )
  } else if (state.activateChatChat) {
    return (
      <>
        <ChatChatWindow chatId={state.chatId} />
      </>
    )
  } else {
    return (
      <>
        <div className='flex flex-col gap-2'>
          { channels.map(channel => (
            <Channel key={channel.id} channelData={channel} />  
          )) }
        </div>
      </>
    )
  }
};

export default InChannel;