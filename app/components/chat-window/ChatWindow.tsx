'use client';

import React, { useState } from 'react'
import ChatMessage from '@/app/components/ChatMessage';
import SearchBar from '@/app/components/SearchBar';
import CreateChat from '@/app/components/CreateChat';
import SortOptions from '@/app/components/SortOptions';
import Chat from '@/app/components/chat-window/Chat';
import { IChat } from '@/app/interfaces';

interface State {
  showFeatures: boolean;
  showCreateChat: boolean;
  showChatList: boolean;
  showAttendantsList: boolean;
  activateUserInput: boolean;
  activateSearch: boolean;
  activateSort: boolean;
}

const ChatWindow = ({ type }: { type: string | null }) => {
  const [state, setState] = useState<State>({
    showFeatures: false,
    showCreateChat: false,
    showChatList: false,
    showAttendantsList: false,
    activateUserInput: false,
    activateSearch: false,
    activateSort: false,
  });
  
  var messages = [
    {
      _id: '1',
      sentBy: 'user 1',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure expedita aperiam consequuntur, dolor suscipit, molestias aspernatur nisi in vitae corrupti hic eaque optio nihil cupiditate. Laboriosam at illo quae sint corporis nulla error illum perferendis nisi suscipit iure, corrupti doloremque qui laborum. Natus cupiditate veritatis dolorum corrupti magni, debitis quisquam.',
      createdAt: '2024-02-02'
    },
    {
      _id: '2',
      sentBy: 'user 2',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure expedita aperiam consequuntur, dolor suscipit, molestias aspernatur nisi in vitae corrupti hic eaque optio nihil cupiditate. Laboriosam at illo quae sint corporis nulla error illum perferendis nisi suscipit iure, corrupti doloremque qui laborum. Natus cupiditate veritatis dolorum corrupti magni, debitis quisquam.',
      createdAt: '2024-02-02'
    },
    {
      _id: '3',
      sentBy: 'user 3',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure expedita aperiam consequuntur, dolor suscipit, molestias aspernatur nisi in vitae corrupti hic eaque optio nihil cupiditate. Laboriosam at illo quae sint corporis nulla error illum perferendis nisi suscipit iure, corrupti doloremque qui laborum. Natus cupiditate veritatis dolorum corrupti magni, debitis quisquam.',
      createdAt: '2024-02-02'
    },
  ];

  var chatRooms = ([
    {
      _id: '1',
      title: '이번달에는 취뽀할 수 있을까요. 빚만 쌓어가는데',
      topic: '취업',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 7
    },
    {
      _id: '2',
      title: '부트캠프 출신인데 이번에 드디어 취직햇어',
      topic: '성공',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 13
    },
    {
      _id: '3',
      title: '이 상황에 이직하는게 맞는가 싶다. 어떻게 해야할지 잘 모르겟어',
      topic: '이직',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 3
    },
    {
      _id: '4',
      title: 'ㅅㅂ 개발 안하련다',
      topic: '포기',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 1
    },
    {
      _id: '5',
      title: 'ㅅㅂㅅㅂㅅㅂㅅㅂ',
      topic: 'ㅅㅂ',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 1
    },
    {
      _id: '6',
      title: 'ㅂㅅㅂㅅㅂㅅㅂㅅㅂㅅ',
      topic: 'ㅂㅅ',
      capacity: 3,
      occupiedBy: 2,
      createdAt: 1
    },
  ]);

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
            { messages.map((message) => (
              <ChatMessage key={message._id} message={message} />
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
                <SearchBar
                  goBack={() => toggleState('activateUserInput')}
                  onSubmit={(searchQuery: string) => console.log(searchQuery) }
                />
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
                { chatRooms.map((chat: IChat) => (
                  <Chat key={chat._id} chat={chat} />
                ))}
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