'use client';

import { useState } from 'react';

import { auth, db } from '@/utils/firebase';

import {
  ChevronDoubleLeftIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

type SortOptionsProps = {
  goBack: Function,
  options: string[],
  onSelect: Function
};
const SortOptions = ({ goBack, options, onSelect } : SortOptionsProps) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelectChange = (e: any) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    onSelect(selectedValue);
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
      <div className='grow p-0.5 rounded-lg border border-black bg-white'>
        <select
          value={selectedOption}
          onChange={handleSelectChange}
          className="
            block w-full px-4 py-2 rounded-md border border-gray-300
            text-sm text-gray-700
            focus:outline-none focus:ring focus:ring-indigo-500
        ">
          { options.map((option: string) => (
            <option key={ option } value={ option }>
              { option }
            </option>
          )) }
        </select>
      </div>
    </div>
  )
};

export default SortOptions;