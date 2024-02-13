import React from 'react';

import InteractionArea from '@/app/components/InteractionArea';
import DirectMessage from './components/DirectMessage';

import { IMessage } from '@/app/interfaces';

const DirectMessages = () => {
  var messages = ([
    {
      _id: '1',
      sentBy: 'user 1',
      content: "blah"
    },
    {
      _id: '2',
      sentBy: 'user 2',
      content: "blah"
    }
  ]);

  return (
    <div className='
      w-screen min-h-screen my-12 px-4
      flex flex-col gap-6
    '>
      {/* interaction area */}
      <InteractionArea />
      

      {/* DMs */}
      <div className='flex flex-col gap-2'>
        { messages.map((message: IMessage) => (
          <DirectMessage key={message._id} message={message} />
        ))}
      </div>
        
    </div>
  );
};

export default DirectMessages;