"use client";

import {
  Avatar,
} from '@mui/material';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, } from 'firebase/firestore';

type pageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: pageProps) => {
  const [activeUsers, setActiveUsers] = useState([]);

  const router = useRouter();

  const [collectionSnapshot, loading, error] = useCollection(
    query(collection(db, 'status_board'),
      where('cid', '==', params.id)
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const activeUserContainer: any = [];
    
    if (collectionSnapshot && !collectionSnapshot.empty) {
      collectionSnapshot.forEach((doc) => {
        activeUserContainer.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setActiveUsers(activeUserContainer)
    }
  }, [collectionSnapshot]);
  
  const redirectToProfile = (uid: string) => {
    if (auth) {
      router.push(`/profile/${uid}`);
    }
  };

  const redirectToFeatures = () => {
    if (auth) {
      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  };

  return (
    <div className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto rounded-lg shadow-sm bg-white
        flex flex-col gap-4
      '>
        <ul className='flex flex-col gap-3'>
          {/* TODO: Refactor: displayName and profilePicUrl is stored in status_board only because of this. */}
          { activeUsers.map((activeUser: any) => (
            <li key={activeUser.id}
              onClick={() => redirectToProfile(activeUser.uid)} className='
              p-3 rounded-lg shadow-sm bg-stone-200
              flex items-center justify-between
            '>
              <div className='flex items-center gap-3'>
                <Avatar src={activeUser.profilePicUrl} alt="Profile Picture" sx={{ width: 52, height: 52 }} />
                <p>{ activeUser.displayName }</p>
              </div>
            </li>
          )) }
        </ul>
      </div>

      <button type="button" onClick={redirectToFeatures} className='
        w-full py-4 rounded-lg shadow-sm bg-white
        transition duration-300 ease-in-out hover:bg-stone-200
      '> Cancel </button>
    </div>
  )
};

export default Page;