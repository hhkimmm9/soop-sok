'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppState } from '@/utils/AppStateProvider';
import Link from 'next/link';
import Image from 'next/image';

import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { TUser } from '@/types';

const UserList = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  const { state, dispatch } = useAppState();

  var cid;
  if (state.activateChannelChat) {
    cid = state.channelId
  }
  else if (state.activateChatChat) {
    cid = state.chatId
  }

  const [realtime_users, loading, error] = useCollection(
    query(collection(db, 'status_board'),
      where('cid', '==', cid)
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const activeUserContainer: any = [];
    
    if (realtime_users && !realtime_users.empty) {
      realtime_users.forEach((doc) => {
        activeUserContainer.push({
          id: doc.id,
          ...doc.data()
        })
      })
      setActiveUsers(activeUserContainer)
    }
  }, [realtime_users]);
  
  return (
    <div className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto
        border border-black rounded-lg bg-white
        flex flex-col gap-4
      '>
        <ul className='flex flex-col gap-2'>
          { activeUsers.map((activeUser: any) => (
            <li key={activeUser.id} className='
              border border-black p-2 rounded-lg
              flex items-center justify-between
            '>
              <div className='flex items-center gap-3'>
                <Image src={activeUser.profilePicUrl} alt='Profile Picture'
                  width={52} height={52}
                  className='rounded-full'
                />
                <p>{ activeUser.displayName }</p>
              </div>

              <Link href={`/profile/${activeUser.uid}`}
                onClick={() => dispatch({ type: 'SET_TO_PAGES' })}
                className='
                  mr-4 border px-2 py-1 rounded-lg
              '>Profile</Link>
            </li>
          )) }
        </ul>
      </div>

      <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features' })}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Cancel</div>
    </div>
  )
}

export default UserList