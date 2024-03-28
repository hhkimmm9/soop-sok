'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/app/utils/AppStateProvider';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

import ChatWindow from './ChatWindow';
import Channel from '@/app/components/Channel';

import { TChannel } from '@/app/types';

const InChannel = () => {
  const [channels, setChannels] = useState<TChannel[]>([]);
  
  const { state, dispatch } = useAppState();

  useEffect(() => {
    fetchChannels();
  }, [])

  const fetchChannels = async () => {
    var channels: TChannel[] = [];
    try {
      const querySnapshot = await getDocs(collection(db, 'channels'));
      querySnapshot.forEach((doc) => {
        channels.push({
          id: doc.id,
          ...doc.data()
        } as TChannel);
      });
      setChannels(channels);
    } catch (err) {
      console.error(err);
    };
  };

  return (
    <>
      { state.activateChannelChat ? (
        <ChatWindow />
      ) : (
        <div className='flex flex-col gap-2'>
          { channels.map(channel => (
            <Channel key={channel.id} channelData={channel} />  
          )) }
        </div>
      ) }
    </>
  )
};

export default InChannel;