import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, addDoc, } from 'firebase/firestore';

import { TChannel } from '@/types';

type ChannelProps = {
  channel: TChannel
};

export const Channel = ({ channel } : ChannelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFull, setIsFull] = useState(true);
  
  const router = useRouter();

  const { dispatch } = useAppState();
  
  // Authenticate a user
  useEffect(() => {
    if (!auth) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch data if a user is authenticated
  const boardRef = collection(db, 'status_board');
  const boardQuery = query(boardRef, where('cid', '==', channel.id));
  const [FSSnapshot, FSLoading, FSError] = useCollection(
    isAuthenticated ? boardQuery : null
  );

  useEffect(() => {
    if (FSSnapshot && FSSnapshot?.size < channel.capacity) {
      setIsFull(false)
    }
  }, [FSSnapshot, channel.capacity]);

  // Handling retrieved data
  useEffect(() => {
    if (FSError !== undefined) {
      // dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
      // dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });

      // TODO: partial error sign
    }
  }, [FSError, dispatch]);
  
  // Local functions
  const enterChannel = async () => {
    // Allow entry into the channel only if it is not full.
    if (auth && auth.currentUser && !isFull) {
      // Log where the user is in.
      try {
        await addDoc(boardRef, {
          cid: channel.id,
          displayName: auth.currentUser.displayName,
          profilePicUrl: auth.currentUser.photoURL,
          uid: auth.currentUser.uid
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
      <h3>{ channel.name }</h3>
      <p># of users: { FSSnapshot?.size } / { channel.capacity }</p>
    </div>
  )
};

export default Channel;