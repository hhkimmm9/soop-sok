import React from 'react'

import Banner from '@/app/components/Banner';
import ChatWindow from '@/app/components/chat-window/ChatWindow';

const Lobby = () => {
  return (
    <div className='flex flex-col gap-3'>
      <Banner />

      <ChatWindow />
    </div>
  )
}

export default Lobby