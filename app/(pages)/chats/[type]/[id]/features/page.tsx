'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const Page = () => {
  const params = useParams();

  return (
    <>
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
          { params.type != 'dm' && (
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
        </div>
      </div>

      <Link href={`/chats/${params.type}/${params.id}`}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Go Back</Link>
    </>
  )
}

export default Page