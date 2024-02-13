'use client';

import React, { useState } from 'react';

import DirectMessage from './components/DirectMessage';

import { IMessage } from '@/app/interfaces';

import {
  ChevronDoubleLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

const DirectMessages = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className='
      w-screen min-h-screen my-12 px-4
      flex flex-col gap-6
    '>
      {/* interaction area */}
      <div className='flex gap-3 items-center'>
        <button type='button' className='
          h-9 border border-black rounded-lg px-1.5 py-1
        '>
          <ChevronDoubleLeftIcon className='h-5 w-5' />
        </button>

        {/* search input field */}
        <div className='
          grow
          bg-white
          border
          border-black
          rounded-lg
          p-0.5
        '>
          <form onSubmit={(e) => handleSearch(e)}
            className='
            h-8 flex items-center justify-between
          '>
            <input type="text"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className='
                grow px-2 py-1 outline-none
            '/>
            <button type='submit' className='mr-2'>
              <MagnifyingGlassIcon className='h-5 w-5'/>
            </button>
          </form>
        </div>
      </div>

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