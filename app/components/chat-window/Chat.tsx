import Link from 'next/link';

import { IChat } from '@/app/interfaces'

const Chat = ({
  chat
} : {
  chat: IChat
}) => {
  return (
    <Link href={`/chats/${1}`}>
      <div className='
        bg-white border border-black px-3 py-2 rounded-lg
        flex flex-col gap-1
      '>
        {/* title */}
        <div>
          <p className='line-clamp-1'>{ chat.title }</p>
        </div>
        
        {/* chat info: created_at */}
        <div className='flex justify-end'>
          <p className='text-sm'>{ chat.createdAt } 분 전</p>
        </div>

        {/* topic, buttons */}
        <div className='flex justify-between'>
          {/* bubble */}
          <div className='
            border rounded-full px-4 py-1 border-black bg-amber-400
            text-xs text-white
          '>
            <span>{ chat.topic }</span>
          </div>
          
          {/* buttons */}
          <div>
            {/*  */}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Chat