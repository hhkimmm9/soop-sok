'use client';

import { useState } from 'react'

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
  showAttendantsList: boolean;
  activateUserInput: boolean;
  activateSearch: boolean;
  activateSort: boolean;
}

const ChatWindow = ({
  type,
  messages,
}: {
  type: string | null,
  messages: IMessage[],
}) => {
  const [state, setState] = useState<State>({
    showFeatures: false,
    showCreateChat: false,
    showChatList: false,
    showAttendantsList: false,
    activateUserInput: false,
    activateSearch: false,
    activateSort: false,
  });

  var attendants = [
    {
      _id: '1',
      name: 'Attendant 1',
      status: 1
    },
    {
      _id: '2',
      name: 'Attendant 2',
      status: 1
    },
    {
      _id: '3',
      name: 'Attendant 3',
      status: 0
    },
  ];

  const toggleState = (key: keyof State) => setState((prevState) => ({ ...prevState, [key]: !prevState[key] }));

  const renderBackButton = (onClick: () => void) => (
    <button onClick={onClick} className='w-full py-2 bg-white border border-black rounded-lg shadow-sm'>
      뒤로 가기
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
                '>메세지 보내기</button>
                <button onClick={() => toggleState('showFeatures')}
                  className='bg-white border border-black py-2 rounded-lg shadow-sm
                '>기능 보기</button>
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
          { !state.showCreateChat && !state.showChatList && !state.showAttendantsList && (
            <>
              <div className='
                grow p-4 overflow-y-auto
                border border-black rounded-lg bg-white
                grid grid-cols-2 gap-4
              '>
                { type === 'lobby' && renderToggleButton('create page', () => toggleState('showCreateChat')) }
                { type != 'dm' && renderToggleButton('chat list', () => toggleState('showChatList')) }
                { renderToggleButton('attendants', () => toggleState('showAttendantsList')) }
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
                '>만들기</button>

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
                  '>검색</button>
                  <button onClick={() => toggleState('activateSort')}
                    className='bg-white border border-black py-2 rounded-lg shadow-sm
                  '>정렬</button>
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

          {/* attendant list component */}
          { state.showAttendantsList && (
            <>
              <div className='
                grow p-4 overflow-y-auto
                border border-black rounded-lg bg-white
                flex flex-col gap-4
              '>
                <ul className='flex flex-col gap-2'>
                  { attendants.map((attendant: any) => (
                    <li key={attendant._id} className='
                      border border-black p-2 rounded-lg
                      flex justify-between
                    '>
                      <p>{ attendant.name }</p>
                      <p>{ attendant.status }</p>
                    </li>
                  )) }
                </ul>
              </div>

              { renderBackButton(() => toggleState('showAttendantsList')) }
            </>
          )}
        </>
      )}
    </div>
  )
};

export default ChatWindow;