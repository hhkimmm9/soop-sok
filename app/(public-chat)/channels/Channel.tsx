import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, doc, query, where,
  getDocs, addDoc, updateDoc,
} from 'firebase/firestore';

import { TChannel } from '@/types';

type ChannelProps = {
  channel: TChannel
};

const Channel = ({ channel } : ChannelProps) => {
  const [isFull, setIsFull] = useState(true);
  const router = useRouter();

  const [collectionSnapshot, loading, error] = useCollection(
    query(collection(db, 'status_board'),
    where('cid', '==', channel.id)
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    if (collectionSnapshot && collectionSnapshot?.size < channel.capacity) {
      setIsFull(false)
    }
  }, [collectionSnapshot, channel.capacity]);
  

  const enterChannel = async () => {
    // Allow entry into the channel only if it is not full.
    if (auth && auth.currentUser && !isFull) {
      // Log where the user is in.
      await addDoc(collection(db, 'status_board'), {
        cid: channel.id,
        displayName: auth.currentUser.displayName,
        profilePicUrl: auth.currentUser.photoURL,
        uid: auth.currentUser.uid
      });
  
      // Redriect to the selected channel page.
      router.push(`/chats/public-chat/${channel.id}/`);
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
      <p># of users: { collectionSnapshot?.size } / { channel.capacity }</p>
    </div>
  )
};

export default Channel;