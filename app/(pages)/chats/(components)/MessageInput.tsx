import { useState } from 'react';
import { useParams } from 'next/navigation';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

import {
  ChevronDoubleLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const MessageInputComponent = ({
  goBack
}: {
  goBack: Function
}) => {
  const [messageInput, setMessageInput] = useState('');

  const params = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (auth.currentUser && messageInput.length > 0) {
      const uid = auth.currentUser.uid;

      const messageRef = await addDoc(collection(db, 'messages'), {
        chatId: params.id,
        createdAt: serverTimestamp(),
        sentBy: uid,
        text: messageInput
      })

      setMessageInput('');
    }
  };

  const inactivateMessageInput = () => {
    console.log('inactivateMessageInput');
    setMessageInput('');
    goBack();
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
};

export default MessageInputComponent;