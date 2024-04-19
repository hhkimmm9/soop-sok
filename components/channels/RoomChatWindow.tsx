'use client';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc, query,
  where, orderBy,
  getDoc, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore';

import Banner from '@/components/chat-window/Banner';
import MessageContainer from '../MessageContainer';
import UserList from '@/components/chat-window/UserList';

type ChatWindowProps = {
  cid: string;
};

const ChatWindow = ({ cid }: ChatWindowProps) => {
  const { state, dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);

  const leaveChat = async () => {
    if (signedInUser) {
      // try {
      //   const channelRef = doc(db, 'channels', cid);
      //   const querySnapshot = await getDoc(channelRef);
      //   const data = querySnapshot.data()
      //   if (data) {
      //     await updateDoc(channelRef, {
      //       numUsers: data.numUsers - 1
      //     });
      //   }
      // } catch (err) {
      //   console.error(err);
      // }
      
      try {
        // find the document id
        const statusRef = query(collection(db, 'status_board'),
          where('cid', '==', cid),
          where('uid', '==', signedInUser?.uid)
        );
        const statusSnapshot = await getDocs(statusRef);
  
        // if found then delete that document.
        if (!statusSnapshot.empty) {
          const deleteRef = doc(db, 'status_board', statusSnapshot.docs[0].id);
          await deleteDoc(deleteRef);
        }
        else {
          // Handle the case where no documents match the query
          // You might want to redirect or display a message to the user
        }

        dispatch({ type: 'LEAVE_CHAT' });
      } catch(error) {
        console.error('An error occurred:', error);
      }
    }
  };

  return (
    <div className='h-full grid grid-rows-12'>
      <Banner />
      <div className='row-start-2 row-span-11'>
        <div className='h-full flex flex-col gap-4'>
          { state.channelComponent === 'chat' && (
            <MessageContainer cid={cid} />
          )}

          {/* features */}
          { state.channelComponent === 'features' && (
            <div className='h-full flex flex-col gap-4'>
              <div className='
                grow p-4 overflow-y-auto
                border border-black rounded-lg bg-white
              '>
                <div className='grid grid-cols-2 gap-4'>
                  <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'user_list' })}
                    className='
                      h-min py-8 flex justify-center items-center
                      border border-black rounded-lg
                  '>User List</div>
                  <div onClick={leaveChat}
                    className='
                      h-min py-8 flex justify-center items-center
                      border border-black rounded-lg
                  '>Leave</div>
                </div>
              </div>
        
              <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'chat' })}
                className='
                w-full py-2 bg-white
                border border-black rounded-lg shadow-sm text-center
              '>Cancel</div>
            </div>
          )}

          { state.channelComponent === 'user_list' && <UserList /> }
        </div>
      </div>
    </div>
    
  )
};

export default ChatWindow;