import React from 'react';

import Banner from '@/app/components/Banner';
import ChatWindow from '@/app/components/ChatWindow';

const DirectMessage = () => {
  return (
    <div className='
      w-screen min-h-screen my-12 px-4
      flex flex-col gap-6
    '>
      <Banner />

      <ChatWindow />
    </div>
  )
};

export default DirectMessage;
