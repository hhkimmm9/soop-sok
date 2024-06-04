import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { updateChannel } from '@/db/utils';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { TChannel } from '@/types';

type ChannelProps = {
  channel: TChannel
};

export const Channel = ({ channel } : ChannelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFull, setIsFull] = useState(false);
  
  const router = useRouter();

  const { dispatch } = useAppState();
  
  // Authorize users before rendering the page.
  useEffect(() => {
    if (!auth) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch channle data in real time only if a user is authorized.
  const channelRef = doc(db, 'channels', channel.id);
  const [FSValue, FSLoading, FSError] = useDocumentData(
    isAuthenticated ? channelRef : null
  );

  useEffect(() => {
    console.log('yy',FSValue)
    if (FSValue?.numMembers >= FSValue?.capacity) {
      setIsFull(true);
    }
  }, [FSValue]);

  // Error: real time data fetching
  useEffect(() => {
    if (FSError !== undefined) {
      // dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
      // dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
    }
  }, [FSError, dispatch]);
  
  // When users join a channel, add them to the 'members' subcollection of the associated channel document and update the 'numMembers' field in the channel document accordingly.
  const handleEnterChannel = async () => {
    // Authorize users.
    if (auth && auth.currentUser && !isFull) {
      // Log where the user is in.
      try {
        const res = await updateChannel(channel.id, auth.currentUser.uid, 'enter');
    
        // Redriect to the selected channel page.
        if (res) router.push(`/chats/channel/${channel.id}/`);
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
      }
    }
  };

  return (
    <div onClick={handleEnterChannel} className={`
      ${!isFull ? '' : 'opacity-50'}
      p-4 rounded-lg shadow-sm bg-white
      transition duration-300 ease-in-out hover:bg-stone-200
      flex flex-col gap-2
    `}>
      <h3 className='font-semibold text-lg'>{ channel.name }</h3>
      <p>Capacity: { FSValue?.numMembers } / { channel.capacity }</p>
    </div>
  )
};

export default Channel;