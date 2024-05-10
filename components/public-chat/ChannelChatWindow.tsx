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

import { TAvailableChannelComponents } from "@/utils/AppStateProvider";

import {
  PlusIcon,
  MegaphoneIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UsersIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

type ChatWindowProps = {
  cid: string,
};

const ChatWindow = ({ cid }: ChatWindowProps) => {
  const { state, dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);

  const redirectTo = (component: TAvailableChannelComponents) => {
    dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: component })
  };
  
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
            <div className="grow p-4 rounded-lg overflow-y-auto bg-white">
              <div className='flex flex-col gap-4'>
                <div onClick={() => redirectTo('create_chat')}
                  className="
                    py-6 rounded-lg bg-stone-100
                    transition duration-300 ease-in-out hover:bg-stone-200
                    flex justify-center"
                > <PlusIcon className='h-8' /> </div>

                <div onClick={() => redirectTo('add_banner')}
                  className="
                    py-6 rounded-lg bg-stone-100
                    transition duration-300 ease-in-out hover:bg-stone-200
                    flex justify-center"
                > <MegaphoneIcon className='h-8' /> </div>

                <div onClick={() => redirectTo('chat_list')}
                  className="
                    py-6 rounded-lg bg-stone-100
                    transition duration-300 ease-in-out hover:bg-stone-200
                    flex justify-center"
                > <ChatBubbleOvalLeftEllipsisIcon className='h-8' /> </div>

                <div onClick={() => redirectTo('user_list')}
                  className="
                    py-6 rounded-lg bg-stone-100
                    transition duration-300 ease-in-out hover:bg-stone-200
                    flex justify-center"
                > <UsersIcon className='h-8' /> </div>

                <div onClick={leaveChat}
                  className="
                    py-6 rounded-lg bg-stone-100
                    transition duration-300 ease-in-out hover:bg-stone-200
                    flex justify-center"
                > <ArrowLeftStartOnRectangleIcon className='h-8' /> </div>
              </div>
            </div>
      
            <button type="button" onClick={() => redirectTo('lobby')}
              className="
                w-full py-4 rounded-lg shadow-sm bg-white
                hover:bg-stone-200 transition duration-300 ease-in-out
              "
            > Cancel </button>
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

      {/*  */}
      <div className='row-start-2 row-span-11'>
        <div className='h-full flex flex-col gap-4'>
          { renderComponent() }
        </div>
      </div>
    </div>
  )
};

export default ChatWindow;