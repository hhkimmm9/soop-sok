'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import SearchBar from '@/app/components/SearchBar';
import SortOptions from '@/app/components/SortOptions';
import Chats from '@/app/(pages)/chats/(components)/Chats';

const ChatListPage = () => {
  const [activateSearch, setActivateSearch] = useState(false);
  const [activateSort, setActivateSort] = useState(false);

  const params = useParams();

  return (
    <div className='h-full flex flex-col gap-4'>
      { !activateSearch && !activateSort && (
        <div className='grid grid-cols-2 gap-2'>
          <button onClick={() => setActivateSearch(true)}
            className='bg-white border border-black py-2 rounded-lg shadow-sm
          '>Search</button>
          <button onClick={() => setActivateSort(true)}
            className='bg-white border border-black py-2 rounded-lg shadow-sm
          '>Sort</button>
        </div>
      )}

      { activateSearch && (
        <SearchBar
          goBack={() => setActivateSearch(false) }
          onSubmit={(searchQuery: string) => console.log(searchQuery) }
        />
      )}

      { activateSort && (
        <SortOptions
          goBack={() => setActivateSort(false)}
          options={['Option A', 'Option B']}
          onSelect={(selectedValue: string) => console.log(selectedValue) }
        />
      )}

      {/* chat list */}
      <div className='
        grow row-span-11 p-4 overflow-y-auto
        border border-black rounded-lg bg-white
        flex flex-col gap-3
      '>
        <Chats />
      </div>

      <Link href={`/chats/${params.type}/${params.id}/features`}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Go Back</Link>
    </div>
  )
};

export default ChatListPage;