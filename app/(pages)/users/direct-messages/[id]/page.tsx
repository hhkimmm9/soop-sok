import React from 'react';

import Banner from '@/app/components/Banner';
import ChatWindow from '@/app/components/chat-window/ChatWindow';

const DirectMessage = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Banner />

      <ChatWindow />
    </div>
  )
};

export default DirectMessage;
