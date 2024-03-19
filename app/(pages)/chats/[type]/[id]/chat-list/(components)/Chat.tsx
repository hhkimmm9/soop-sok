'use client';

import Link from 'next/link';
import { formatTimeAgo } from '@/app/utils/utils';
import { IChat } from '@/app/interfaces'

type chatProp = {
  chat: IChat
};

const Chat = ({ chat }: chatProp) => {
  return (
    <div key={chat.id}>
      <Link href={`/chats/chat/${chat.id}`}>
        <div className='
          bg-white border border-black px-3 py-2 rounded-lg
          flex flex-col gap-1
        '>
          <div>
            {/* name */}
            <div>
              <p className='line-clamp-1'>{ chat.name }</p>
            </div>
            
            {/* chat info: created_at */}
            <div className='flex justify-end'>
              <p className='text-sm'>{ formatTimeAgo(chat.createdAt) }</p>
            </div>

            {/* topic, buttons */}
            <div className='flex justify-between'>
              {/* bubble */}
              <div className='
                rounded-full px-4 py-1 bg-amber-500
                text-xs text-white
              '>
                <span>whatever</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
};

export default Chat;