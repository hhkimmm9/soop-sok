'use client';

import { useState } from 'react';

import {
  ChevronDoubleLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const SearchBar = ({
  goBack
} : {
  goBack: Function
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className='flex gap-3 items-center'>
      <button onClick={() => goBack()}
        className='
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
  )
}

export default SearchBar