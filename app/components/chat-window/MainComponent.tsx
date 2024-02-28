'use client';

import { useState } from 'react';

import ChatMessage from '../ChatMessage';
import CreateChat from '../CreateChat';

import SearchBar from '@/app/components/SearchBar';
import SortOptions from '@/app/components/SortOptions';
import Chat from '@/app/components/chat-window/Chat';

import { IChat } from '@/app/interfaces';

const MainComponent = ({
  showFeatures, setShowFeatures,
  showCreateChat, setShowCreateChat,
  showChatList, setShowChatList,
  showAttendantsList, setShowAttendantsList
} : {
  showFeatures: boolean, setShowFeatures: any,
  showCreateChat: boolean, setShowCreateChat: any,
  showChatList: boolean, setShowChatList: any,
  showAttendantsList: boolean, setShowAttendantsList: any
}) => {
  const [activateSearch, setActivateSearch] = useState<boolean>(false);
  const [activateSort, setActivateSort] = useState<boolean>(false);
  
  // depending on how Firestore handles it.
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
  
  return (
    <>
      { !showFeatures ? (
        <div className='
          row-span-11 p-4 overflow-y-auto
          border border-black rounded-lg bg-white
          flex flex-col gap-5
        '>
          { messages.map((message) => (
            <ChatMessage key={message._id} message={message} />
          ))}
        </div>
      ) : (
        <>
          {/* features */}
          { !showCreateChat && !showChatList && !showAttendantsList && (
            <div className='
              row-span-11 p-4 overflow-y-auto
              border border-black rounded-lg bg-white
              grid grid-cols-2 gap-4
            '>
              <div onClick={() => setShowCreateChat(true)}
                className='border flex justify-center items-center shadow-sm'
              >
                create page
              </div>
              <div onClick={() => setShowChatList(true)}
                className='border flex justify-center items-center shadow-sm'>
                chat list
              </div>
              <div onClick={() => setShowAttendantsList(true)}
                className='border flex justify-center items-center shadow-sm'
              >
                attendants
              </div>
              <div className='border flex justify-center items-center shadow-sm'>
                feature 4
              </div>
              <div className='border flex justify-center items-center shadow-sm'>
                feature 5
              </div>
              <div className='border flex justify-center items-center shadow-sm'>
                feature 6
              </div>
            </div>
          )}

          {/* create chat component */}
          { showCreateChat && (
            <div className='
              row-span-11 p-4 overflow-y-auto
              border border-black rounded-lg bg-white
              flex flex-col gap-3
            '>
              <CreateChat
                showCreateChat={showCreateChat}
                setShowCreateChat={setShowCreateChat}
              />
            </div>
          )}

          {/* chat list component */}
          { showChatList && (
            <>
              { !activateSearch && !activateSort && (
                <div className='grid grid-cols-2 gap-2'>
                  <button onClick={() => setActivateSearch(true)}
                    className='
                      bg-white
                      border
                      border-black
                      py-2
                      rounded-lg
                      shadow-sm
                  '>검색</button>
                  <button onClick={() => setActivateSort(true)}
                    className='
                      bg-white
                      border
                      border-black
                      py-2
                      rounded-lg
                      shadow-sm
                  '>정렬</button>
                </div>
              )}

              { activateSearch && (
                <SearchBar goBack={() => setActivateSearch(false) }/>
              )}

              { activateSort && (
                <SortOptions
                  goBack={() => setActivateSort(false)}
                  options={['Option A','Option B']}
                  onSelect={(selectedValue: string) => { console.log(selectedValue) }}
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
            </>
          )}

          {/* attendant list component */}
          { showAttendantsList && (
            <div className='
              row-span-11 p-4 overflow-y-auto
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
          )}
        </>
      )}
    </>
  )
};

export default MainComponent;