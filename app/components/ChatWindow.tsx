'use client';

import { useState } from 'react'

import ChatMessage from './ChatMessage';
import SearchBar from './SearchBar';

const ChatWindow = () => {
  const [activateUserInput, setActivateUserInput] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

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
  ]

  return (
    <div className='h-5/6 grow grid grid-rows-12 gap-3'>
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
        <div className='
          row-span-11 p-4 overflow-y-auto
          border border-black rounded-lg bg-white
          grid grid-cols-2 gap-4
        '>
          <div className='border flex justify-center items-center shadow-sm'>
            feature 1
          </div>
          <div className='border flex justify-center items-center shadow-sm'>
            feature 2
          </div>
          <div className='border flex justify-center items-center shadow-sm'>
            feature 3
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


      <div className='row-span-1'>

        { !activateUserInput && !showFeatures && (
          <div className='grid grid-cols-2 gap-2'>
            <button onClick={() => setActivateUserInput(true)}
              className='
                bg-white
                border
                border-black
                py-2
                rounded-lg
                shadow-sm
            '>메세지 보내기</button>
            <button onClick={() => setShowFeatures(true)}
              className='
                bg-white
                border
                border-black
                py-2
                rounded-lg
                shadow-sm
            '>기능 보기</button>
          </div>
        )}

        { activateUserInput && (
          <SearchBar goBack={() => setActivateUserInput(false)} />
        )}

        { showFeatures && (
          <button onClick={() => setShowFeatures(false)}
            className='
            w-full py-2 bg-white
            border border-black rounded-lg shadow-sm
          '>뒤로 가기</button>
        )}
      </div>
    </div>
  )
};

export default ChatWindow;