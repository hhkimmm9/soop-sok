'use client';

import { useState } from 'react';
import Image from 'next/image';

const UserListPage = () => {
  const [activatedTab, setActivedTab] = useState('friendsList');

  var users = [
    {
      _id: '1',
      name: 'User 1',
    },
    {
      _id: '2',
      name: 'User 2',
    },
    {
      _id: '3',
      name: 'User 3',
    },
  ];
  
  return (
    <div>
      <div className='grid grid-cols-2'>
        <button onClick={() => setActivedTab('friendsList')}
          className={`
            border-l border-t border-b border-black
            py-1 rounded-tl-lg rounded-bl-lg
            ${ activatedTab === 'friendsList' ? 'bg-white': 'bg-gray-100'}
        `}>친구 리스트</button>
        <button onClick={() => setActivedTab('attendantsList')}
          className={`
            border-r border-t border-b border-black
            py-1 rounded-tr-lg rounded-br-lg
            ${ activatedTab === 'attendantsList' ? 'bg-white': 'bg-gray-100'}
        `}>참여 유저 보기</button>
      </div>

      <div className='mt-8'>
        { activatedTab === 'friendsList' && (
          <div className='flex flex-col gap-2'>
            { users.map((user: any) => (
              <div key={user._id}
                className='
                  border border-black bg-white p-4 rounded-lg shadow-sm
                  flex gap-3
              '>
                <Image
                  src='https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/IMG_2531.jpeg?alt=media&token=a0566f94-5879-439b-9114-193f3564d378'
                  alt=''
                  width={1324}
                  height={1827}
                  className='
                    object-cover
                    w-12 h-12
                    rounded-full
                '/>

                <div>
                  {/* last signed in, where they are */}
                  <p className='font-semibold'>{ user.name }</p>
                  <p>status: online</p>
                </div>
              </div>
            )) }
          </div>
        )}

        { activatedTab === 'attendantsList' && (
          <></>
        )}
      </div>
    </div>
  )
};

export default UserListPage;