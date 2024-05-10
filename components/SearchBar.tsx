'use client';

import { useState } from 'react';

import {
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

type SearchBarProps = {
  onSubmit: Function,
};

const SearchBar = ({ onSubmit } : SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = async (searchQuery: string) => {
    setSearchQuery(searchQuery);

    // onSubmit(searchQuery)
  };

  return (
    <div className='flex gap-3 items-center'>
      {/* search input field */}
      <div className='grow p-0.5 rounded-lg bg-white'>
        <div className='h-10 flex items-center justify-between'>
          <input type="text"
            value={searchQuery} onChange={(e) => handleChange(e.target.value)}
            className='grow px-2 py-1 outline-none'
          />
          <button type='submit' className='mr-2'>
            <MagnifyingGlassIcon className='h-5 w-5'/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar