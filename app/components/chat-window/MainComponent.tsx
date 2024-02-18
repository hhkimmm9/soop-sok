'use client';

import { useState } from 'react';

import ChatMessage from '../ChatMessage';
import CreateChat from '../CreateChat';

const MainComponent = ({
  activateUserInput, setActivateUserInput,
  showFeatures, setShowFeatures,
  showCreatePage, setShowCreatePage,
  showAttendantsList, setShowAttendantsList
} : {
  activateUserInput: boolean, setActivateUserInput: any,
  showFeatures: boolean, setShowFeatures: any,
  showCreatePage: boolean, setShowCreatePage: any,
  showAttendantsList: boolean, setShowAttendantsList: any
}) => {
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
          { !showCreatePage && !showAttendantsList && (
            <div className='
              row-span-11 p-4 overflow-y-auto
              border border-black rounded-lg bg-white
              grid grid-cols-2 gap-4
            '>
              <div onClick={() => setShowCreatePage(true)}
                className='border flex justify-center items-center shadow-sm'
              >
                create page
              </div>
              <div onClick={() => setShowAttendantsList(true)}
                className='border flex justify-center items-center shadow-sm'
              >
                attendants
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

          { showCreatePage && (
            <div className='
              row-span-11 p-4 overflow-y-auto
              border border-black rounded-lg bg-white
              flex flex-col gap-3
            '>
              <CreateChat
                showCreatePage={showCreatePage}
                setShowCreatePage={setShowCreatePage}
              />
            </div>
          )}

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