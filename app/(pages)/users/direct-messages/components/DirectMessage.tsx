import React from 'react'

import Image from 'next/image';
import Link from 'next/link';

import { IMessage } from '@/app/interfaces';

const DirectMessageComponent = ({
  message
} : {
  message: IMessage
}) => {
  return (
    <Link href={`/user/direct-messages/${1}`}>
      <div className='
        bg-white border border-black px-3 py-2 rounded-lg
        flex gap-3 items-center
      '>
        <Image
          src='https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/IMG_2531.jpeg?alt=media&token=a0566f94-5879-439b-9114-193f3564d378' alt=''
          width={1324} height={1827}
          className='
            object-cover
            w-16 h-16
            rounded-full
        '/>

        {/*  */}
        <div className='grow w-min'>
          {/*  */}
          <div className='flex justify-between'>
            <p>은솔공주</p>
            <p>7 mins ago</p>
          </div>

          {/*  */}
          <div className='mt-1'>
            <p className='
              h-[3rem]
              overflow-hidden
              line-clamp-2
            '>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt blanditiis optio aliquam placeat aliquid. Ipsa blanditiis excepturi tempore enim molestias eum hic, consectetur optio molestiae impedit minus est dolorem nesciunt.</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default DirectMessageComponent