'use client';

import Banner from '@/components/chat-window/Banner';
import MessageContainer from '@/components/chat-window/MessageContainer';
import UserList from '@/components/chat-window/features/UserList';

import { useAppState } from '@/utils/AppStateProvider';

import { auth, db } from '@/utils/firebase';
import { collection, doc, query, where, getDocs, deleteDoc, } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

type ChatWindowProps = {
  cid: string;
};

const ChatWindow = ({ cid }: ChatWindowProps) => {
  const { state, dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);

  const redirectToUserList = () => {
    dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'user_list' });
  };

  const redirectToChatWindow = () => {
    dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'chat' });
  };

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

  const renderComponent = () => {
    switch (state.channelComponent) {
      // message container
      case "chat":
        return <MessageContainer cid={cid} />;
      
      // features page
      case "features":
        return (
          <div className='h-full flex flex-col gap-4'>
            <div className='
              grow p-4 overflow-y-auto
              border border-black rounded-lg bg-white
            '>
              <div className='grid grid-cols-2 gap-4'>
                <div onClick={redirectToUserList} className='
                  h-min py-8 flex justify-center items-center
                  border border-black rounded-lg
                '>User List</div>
                <div onClick={leaveChat} className='
                  h-min py-8 flex justify-center items-center
                  border border-black rounded-lg
                '>Leave</div>
              </div>
            </div>
      
            <div onClick={redirectToChatWindow} className='
              w-full py-2 bg-white
              border border-black rounded-lg shadow-sm text-center
            '>Cancel</div>
          </div>
        );

      // user list page
      case "user_list":
        return <UserList />;
    };
  };

  return (
    <div className='h-full p-4 grid grid-rows-12 bg-stone-100'>
      <Banner />
      <div className='row-start-2 row-span-11'>
        <div className='h-full flex flex-col gap-4'>
          { renderComponent() }
        </div>
      </div>
    </div>
    
  )
};

export default ChatWindow;