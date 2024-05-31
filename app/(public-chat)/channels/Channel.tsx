import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

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
    if (FSValue?.numMembers < FSValue?.capacity) {
      setIsFull(false)
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
  const enterChannel = async () => {
    // Authorize users.
    if (auth && auth.currentUser && !isFull) {
      // Log where the user is in.
      try {
        // TODO: use Transactions and batched writes.
        const membersRef = doc(db, 'channels', channel.id, 'members', auth.currentUser.uid);
        // Add the user to the 'members' subcollection of the channel document.
        await setDoc(membersRef, {
          displayName: auth.currentUser.displayName,
          email: auth.currentUser.email,
          photoURL: auth.currentUser.photoURL,
        });

        // Update the number of members in the channel.
        const channelRef = doc(db, 'channels', channel.id);
        await updateDoc(channelRef, {
          numMembers: channel.numMembers + 1
        });
    
        // Redriect to the selected channel page.
        router.push(`/chats/public-chat/${channel.id}/`);
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'general' });
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
      }
    }
  };

  return (
    <div onClick={enterChannel} className={`
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