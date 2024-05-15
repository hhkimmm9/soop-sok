"use client";

import ProgressIndicator from '@/components/ProgressIndicator';
import {
  Avatar,
} from '@mui/material';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState([]);

  const router = useRouter();

  const [collectionSnapshot] = useCollection(
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
    setIsLoading(false);
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

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (
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
                {/* <Avatar src={activeUser.profilePicUrl} alt="Profile Picture" sx={{ width: 52, height: 52 }} /> */}
                <Image src={activeUser.profilePicUrl} alt="Profile Picture"
                  width={52} height={52} className='object-cover'
                />
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