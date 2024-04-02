'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/app/utils/AppStateProvider';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  collection, doc, query,
  where, orderBy,
  getDoc, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore';

import Banner from '@/app/components/chat-window/Banner';
import ChatMessage from '@/app/components/chat-window/ChatMessage';
import MessageInput from '@/app/components/chat-window/MessageInput';
import CreateChat from '@/app/components/chat-window/CreateChat';
import ChatList from '@/app/components/chat-window/ChatList';
import UserList from '@/app/components/chat-window/UserList';

import { TMessage } from '@/app/types';
import {
  Bars3Icon,
} from '@heroicons/react/24/outline';

type ChatWindowProps = {
  chatId: string;
};

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [cid, setCid] = useState('');

  const { state, dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);

  var channelId: string | null = localStorage.getItem('channelId');

  const [realtime_messages] = useCollection(
    query(collection(db, 'messages'),
      where('chatId', '==', cid),
      orderBy('createdAt', 'asc')
    ), {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const messageList: TMessage[] = []; 
    if (realtime_messages && !realtime_messages.empty) {
      realtime_messages.forEach((doc) => {
        messageList.push({
          id: doc.id,
          ...doc.data()
        } as TMessage);
      });
      setMessages(messageList);
    }
  }, [realtime_messages]);

  useEffect(() => {
    if (state.chatId.length == 0) {
      console.log('channelId: ', state.channelId);
      setCid(state.channelId);
    } else {
      console.log('chatId: ', state.chatId);
      setCid(state.chatId);
    }
  }, [state.channelId, state.chatId]);
  

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
            <>
              <div className='
                grow p-4 overflow-y-auto
                border border-black rounded-lg bg-white
                flex flex-col gap-5
              '>
                { messages.map((message: TMessage) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>

              <div className='flex justify-between gap-3'>
                <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features'})}
                  className='flex items-center border border-black p-2 rounded-lg bg-white'
                >
                  <Bars3Icon className='h-5 w-5' />
                </div>
                <div className='grow'>
                  <MessageInput chatId={chatId} />
                </div>
              </div>
            </>  
          )}

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

          { state.channelComponent === 'user_list' && (
            <UserList />
          )}
        </div>
      </div>
    </div>
    
  )
};

export default ChatWindow;