'use client';

import SearchBar from '@/app/components/SearchBar';
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
    <div className='flex flex-col gap-6'>
      {/* interaction area */}
      <SearchBar
        goBack={() => { console.log('go back') }}
        onSubmit={(searchQuery: string) => console.log(searchQuery) }
      />

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