'use client';

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

import ChatMessage from '@/app/components/ChatMessage';
import MessageInput from '@/app/(pages)/chats/(components)/MessageInput';
import SearchBar from '@/app/components/SearchBar';
import CreateChat from '@/app/components/CreateChat';
import SortOptions from '@/app/components/SortOptions';
import Chats from '@/app/components/chat-window/Chats';

import { IMessage } from '@/app/interfaces';

interface State {
  showFeatures: boolean;
  showCreateChat: boolean;
  showChatList: boolean;
  showOnlineUsers: boolean;
  activateUserInput: boolean;
  activateSearch: boolean;
  activateSort: boolean;
}

const ChatWindow = () => {
  const [state, setState] = useState<State>({
    showFeatures: false,
    showCreateChat: false,
    showChatList: false,
    showOnlineUsers: false,
    activateUserInput: false,
    activateSearch: false,
    activateSort: false,
  });
  const [messages, setMessages] = useState<IMessage[]>([]);

  var onlineUsers = [
    {
      _id: '1',
      name: 'User 1',
      status: 1
    },
    {
      _id: '2',
      name: 'User 2',
      status: 1
    },
    {
      _id: '3',
      name: 'User 3',
      status: 0
    },
  ];

  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    var messages: IMessage[] = []
    try {
      const q = query(collection(db, 'messages'), where('chatId', '==', params.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          chatId: doc.data().chatId,
          createdAt: doc.data().createdAt,
          sentBy: doc.data().sentBy,
          text: doc.data().text
          // ...doc.data()
        })
      });
      setMessages(messages);
    } catch (err) {
      console.error(err);
    };
  };

  const toggleState = (key: keyof State) => setState((prevState) => ({ ...prevState, [key]: !prevState[key] }));

  const renderBackButton = (onClick: () => void) => (
    <button onClick={onClick} className='w-full py-2 bg-white border border-black rounded-lg shadow-sm'>
      Back
    </button>
  );

  const renderToggleButton = (text: string, onClick: () => void) => (
    <div onClick={onClick} className='border flex justify-center items-center shadow-sm'>
      {text}
    </div>
  );

  return (

    <div className='h-[80vh] flex flex-col gap-4'>
      { !state.showFeatures ? (
        <>
          <div className='
            p-4 overflow-y-auto
            border border-black rounded-lg bg-white
            flex flex-col gap-5
          '>
            { messages.map((message: IMessage) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>

          <div className=''>
            { !state.activateUserInput ? (
              <div className='grid grid-cols-2 gap-2'>
                <button onClick={() => toggleState('activateUserInput')}
                  className='bg-white border border-black py-2 rounded-lg shadow-sm
                '>Send a message</button>
                <button onClick={() => toggleState('showFeatures')}
                  className='bg-white border border-black py-2 rounded-lg shadow-sm
                '>Other features</button>
              </div>
            ) : (
              <div className=''>
                <MessageInput goBack={() => toggleState('activateUserInput') } />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* features */}
          { !state.showCreateChat && !state.showChatList && !state.showOnlineUsers && (
            <>
              <div className='
                grow p-4 overflow-y-auto
                border border-black rounded-lg bg-white
                grid grid-cols-2 gap-4
              '>
                { searchParams.get('type') === 'lobby' && renderToggleButton('create page', () => toggleState('showCreateChat')) }
                { searchParams.get('type') != 'dm' && renderToggleButton('chat list', () => toggleState('showChatList')) }
                { renderToggleButton('online users', () => toggleState('showOnlineUsers')) }
                { renderToggleButton('feature 4', () => {}) }
                { renderToggleButton('feature 5', () => {}) }
                { renderToggleButton('feature 6', () => {}) }
              </div>

              { renderBackButton(() => toggleState('showFeatures')) }
            </>
          )}

          {/* create chat component */}
          { state.showCreateChat && (
            <>
              <div className='
                grow p-4 overflow-y-auto
                border border-black rounded-lg bg-white
                flex flex-col gap-3
              '>
                <CreateChat
                  toggleState={() => toggleState('showCreateChat')}
                />
              </div>

              <div className='grid grid-cols-2 gap-2.5'>
                <button onClick={() => {}}
                  className='
                  w-full py-2 bg-white
                  border border-black rounded-lg shadow-sm
                '>Create</button>

                { renderBackButton(() => toggleState('showCreateChat')) }
              </div>
            </>
          )}

          {/* chat list component */}
          { state.showChatList && (
            <>
              { !state.activateSearch && !state.activateSort && (
                <div className='grid grid-cols-2 gap-2'>
                  <button onClick={() => toggleState('activateSearch')}
                    className='bg-white border border-black py-2 rounded-lg shadow-sm
                  '>Search</button>
                  <button onClick={() => toggleState('activateSort')}
                    className='bg-white border border-black py-2 rounded-lg shadow-sm
                  '>Sort</button>
                </div>
              )}

              { state.activateSearch && (
                <SearchBar
                  goBack={() => toggleState('activateSearch') }
                  onSubmit={(searchQuery: string) => console.log(searchQuery) }
                />
              )}

              { state.activateSort && (
                <SortOptions
                  goBack={() => toggleState('activateSort')}
                  options={['Option A', 'Option B']}
                  onSelect={(selectedValue: string) => console.log(selectedValue) }
                />
              )}

              {/* chat list */}
              <div className='
                row-span-11 p-4 overflow-y-auto
                border border-black rounded-lg bg-white
                flex flex-col gap-3
              '>
                <Chats />
              </div>

              { renderBackButton(() => toggleState('showChatList')) }
            </>
          )}

          {/* onlineUsers component */}
          { state.showOnlineUsers && (
            <>
              <div className='
                grow p-4 overflow-y-auto
                border border-black rounded-lg bg-white
                flex flex-col gap-4
              '>
                <ul className='flex flex-col gap-2'>
                  { onlineUsers.map((onlineUser: any) => (
                    <li key={onlineUser._id} className='
                      border border-black p-2 rounded-lg
                      flex justify-between
                    '>
                      <p>{ onlineUser.name }</p>
                      <p>{ onlineUser.status }</p>
                    </li>
                  )) }
                </ul>
              </div>

              { renderBackButton(() => toggleState('showOnlineUsers')) }
            </>
          )}
        </>
      )}
    </div>
  )
};

export default ChatWindow;