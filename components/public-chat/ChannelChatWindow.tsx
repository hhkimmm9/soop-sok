'use client';

import Banner from '@/components/chat-window/Banner';
import MessageContainer from '@/components/chat-window/MessageContainer';
import CreateChat from '@/components/chat-window/features/CreateChat';
import AddBanner from '@/components/chat-window/features/AddBanner';
import ChatList from '@/components/chat-window/features/ChatList';
import UserList from '@/components/chat-window/features/UserList';

import { useAppState } from '@/utils/AppStateProvider';

import { auth, db } from '@/utils/firebase';
import {
  collection, doc, query, where,
  getDoc, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

type ChatWindowProps = {
  cid: string,
};

const ChatWindow = ({ cid }: ChatWindowProps) => {
  const { state, dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);
  
  const leaveChat = async () => {
    if (signedInUser) {
      try {
        const channelRef = doc(db, 'channels', cid);
        const querySnapshot = await getDoc(channelRef);
        const data = querySnapshot.data();

        if (data) {
          await updateDoc(channelRef, {
            numUsers: data.numUsers - 1
          });
        }
      } catch (err) {
        console.error(err);
      }
      
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
  
          // if you were in a chat, leave the chat
          if (state.chatId.length > 0) {
            dispatch({ type: 'LEAVE_CHAT' });
            dispatch({ type: 'ENTER_CHANNEL', channelId: state.channelId });
          }
          // if you were in a channel, leave the channel
          else {
            dispatch({ type: 'LEAVE_CHANNEL' });
          }
        }
        else {
          // Handle the case where no documents match the query
          // You might want to redirect or display a message to the user
        }
      } catch(error) {
        console.error('An error occurred:', error);
      }
    }
  };

  const renderComponent = () => {
    switch (state.channelComponent) {
      // message container
      case "lobby":
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
                <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'create_chat' })}
                  className='
                    h-min py-8 flex justify-center items-center
                    border border-black rounded-lg
                '>Create Chat</div>
                <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'add_banner' })}
                  className='
                    h-min py-8 flex justify-center items-center
                    border border-black rounded-lg
                '>New Banner</div>
                <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'chat_list' })}
                  className='
                    h-min py-8 flex justify-center items-center
                    border border-black rounded-lg
                '>Chat List</div>
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
      
            <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'lobby' })}
              className='
              w-full py-2 bg-white
              border border-black rounded-lg shadow-sm text-center
            '>Cancel</div>
          </div>
        );

      case "create_chat":
        return <CreateChat />;
      
      case "add_banner":
        return <AddBanner />;
      
      case "chat_list":
        return <ChatList />;

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