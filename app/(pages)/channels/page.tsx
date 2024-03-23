'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

import Channel from './(components)/Channel';

import { TChannel } from '@/app/types';

const SelectChannel = () => {
  const [channels, setChannels] = useState<TChannel[]>([]);
  
  // const [signedInUser, loading, error] = useAuthState(auth);

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
          capacity: doc.data().capacity,
          name: doc.data().name,
          numUsers: doc.data().numUsers
          // ...doc.data()
        })
      });
      setChannels(channels);
    } catch (err) {
      console.error(err);
    };
  };

  return (
    <div className='flex flex-col gap-2'>
      { channels.map(channel => (
        <Channel key={channel.id} channelData={channel} />  
      )) }
    </div>
  )
};

export default SelectChannel;