import { useState } from 'react';

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/db/firebase';
import { sendMessage } from '@/db/utils';

import {
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

type MessageinputProps = {
  cid: string,
};

const MessageInput = ({ cid }: MessageinputProps) => {
  const [message, setMessage] = useState('');

  const { state, dispatch } = useAppState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // check if the user is signed in and the length of the input is greater than 0.
    if (auth && auth.currentUser && message.length > 0) {
      const uid = auth.currentUser.uid;
      const senderName = auth.currentUser.displayName;
      const senderPhotoURL = auth.currentUser.photoURL;
      
      try {
        await sendMessage(uid, cid, senderName, senderPhotoURL, message);
  
        setMessage('');
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'general' } });
      }
    }
  };

  return (
    <div className='flex gap-3 items-center'>
      {/* search input field */}
      <div className='grow p-0.5 rounded-lg shadow-sm bg-white'>
        <form onSubmit={(e) => handleSubmit(e)}
          className='h-8 flex items-center justify-between'>
          <input type='text'
            value={message} onChange={(e) => setMessage(e.target.value)}
            className='grow px-2 py-1 outline-none'
          />
          <button type='submit' className='mr-2'>
            <PaperAirplaneIcon className='h-5 w-5'/>
          </button>
        </form>
      </div>
    </div>
  )
};

export default MessageInput;