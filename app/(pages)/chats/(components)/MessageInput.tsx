import { useState } from 'react';
import { useParams } from 'next/navigation';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import {
  ChevronDoubleLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const MessageInputComponent = ({
  cancel
}: {
  cancel: Function
}) => {
  const [messageInput, setMessageInput] = useState('');

  const params = useParams();

  const [signedInUser] = useAuthState(auth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // check if the user is signed in and the length of the input is greater than 0.
    if (auth.currentUser && messageInput.length > 0) {
      const uid = signedInUser?.uid;

      await addDoc(collection(db, 'messages'), {
        chatId: params.id,
        createdAt: serverTimestamp(),
        sentBy: uid,
        text: messageInput
      })

      setMessageInput('');
    }
  };

  const inactivateMessageInput = () => {
    setMessageInput('');
    cancel();
  };

  return (
    <div className='flex gap-3 items-center'>
      { params.type !== 'dm' && (
        <button onClick={() => inactivateMessageInput()}
          className='
            h-9 border border-black rounded-lg px-1.5 py-1
        '>
          <ChevronDoubleLeftIcon className='h-5 w-5' />
        </button>
      )}

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
};

export default MessageInputComponent;