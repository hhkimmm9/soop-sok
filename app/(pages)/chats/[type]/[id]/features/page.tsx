'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();

  var channelId;
  if (localStorage.getItem('channelId')) {
    channelId = localStorage.getItem('channelId');
  }

  return (
    <div className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto
        border border-black rounded-lg bg-white
      '>
        <div className='grid grid-cols-2 gap-4'>
          { params.type === 'lobby' && (
            <Link href={`/chats/${params.type}/${params.id}/create`}
              className='
                h-min py-8 flex justify-center items-center
                border border-black rounded-lg
            '>Create Chat</Link>
          ) }
          { params.type === 'lobby' && (
            <Link href={`/chats/${params.type}/${params.id}/chat-list`}
              className='
                h-min py-8 flex justify-center items-center
                border border-black rounded-lg
            '>Chat List</Link>
          ) }
          <Link href={`/chats/${params.type}/${params.id}/online-users`}
            className='
              h-min py-8 flex justify-center items-center
              border border-black rounded-lg
          '>User List</Link>
          { params.type === 'chat' && (
            <Link href={`/chats/lobby/${channelId}`}
              className='
                h-min py-8 flex justify-center items-center
                border border-black rounded-lg
            '>Leave</Link>
          )}
        </div>
      </div>

      <Link href={`/chats/${params.type}/${params.id}`}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Go Back</Link>
    </div>
  )
}

export default Page