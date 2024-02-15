import React from 'react';

import Banner from '@/app/components/Banner';
import ChatWindow from '@/app/components/ChatWindow';

const DirectMessage = () => {
  return (
    <div className='
      w-screen h-screen px-4 py-8
      flex flex-col gap-4
    '>
      <Banner />

      <ChatWindow />
    </div>
  )
};

export default DirectMessage;
