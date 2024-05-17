import { useState } from 'react';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import {
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

type MessageinputProps = {
  cid: string,
};

const MessageInput = ({ cid }: MessageinputProps) => {
  const [messageInput, setMessageInput] = useState('');

  const { state, dispatch } = useAppState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // check if the user is signed in and the length of the input is greater than 0.
    if (auth && auth.currentUser && messageInput.length > 0) {
      const uid = auth.currentUser.uid;
      
      try {
        await addDoc(collection(db, 'messages'), {
          cid: cid,
          createdAt: serverTimestamp(),
          sentBy: uid,
          text: messageInput
        })
  
        setMessageInput('');
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'general' });
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: false });
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
            value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
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