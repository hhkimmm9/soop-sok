import {
  Avatar,
} from '@mui/material';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, } from 'firebase/firestore';

const UserList = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  const router = useRouter();

  const { state, dispatch } = useAppState();

  var cid;
  if (state.activateChannelChat) cid = state.channelId;
  else if (state.activateRoomChat) cid = state.chatId;

  const [collectionSnapshot, loading, error] = useCollection(
    query(collection(db, 'status_board'),
      where('cid', '==', cid)
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
      dispatch({ type: 'SET_TO_PAGES' });
    }
  };

  const redirectToFeatures = () => {
    if (auth) dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features' });
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

export default UserList;