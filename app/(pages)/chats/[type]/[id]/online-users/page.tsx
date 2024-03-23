'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const OnlineUsersPage = () => {
  const params = useParams();

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
  
  return (
    <div className='h-full flex flex-col gap-4'>
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

      <Link href={`/chats/${params.type}/${params.id}/features`}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Go Back</Link>
    </div>
  )
};

export default OnlineUsersPage;