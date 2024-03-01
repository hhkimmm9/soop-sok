import { useState } from 'react';
import {
  ChevronDoubleLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const MessageInput = ({
  goBack
}: {
  goBack: Function
}) => {
  const [messageInput, setMessageInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit');
    setMessageInput('');
  };

  const inactivateMessageInput = () => {
    console.log('inactivateMessageInput');
    setMessageInput('');
    goBack()
  };

  return (
    <div className='flex gap-3 items-center'>
      <button onClick={() => inactivateMessageInput()}
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
        <form onSubmit={(e) => handleSubmit(e)}
          className='
          h-8 flex items-center justify-between
        '>
          <input type="text"
            value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
            className='
              grow px-2 py-1 outline-none
          '/>
          <button type='submit' className='mr-2'>
            <PaperAirplaneIcon className='h-5 w-5'/>
          </button>
        </form>
      </div>
    </div>
  )
}

export default MessageInput