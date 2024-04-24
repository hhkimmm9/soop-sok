'use client';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from 'firebase/firestore';

import { formatTimeAgo } from '@/utils/utils';
import { TChat } from '@/types'

type ChatProps = {
  chat: TChat
};

const Chat = ({ chat }: ChatProps) => {
  const { dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);

  const enterChat = async () => {
    const statusRef = collection(db, 'status_board');
    await addDoc(statusRef, {
      cid: chat.id,
      displayName: signedInUser?.displayName,
      profilePicUrl: signedInUser?.photoURL,
      uid: signedInUser?.uid
    });

    dispatch({ type: 'ENTER_CHAT', chatId: chat.id });
  };

  return (
    <div onClick={enterChat} className='
      px-3 py-2 rounded-lg flex flex-col gap-2 bg-stone-100 shadow-md
    '>
      {/* name */}
      <div>
        <p className='line-clamp-1 font-semibold'>{ chat.name }</p>
      </div>
      
      <div>
        {/* created_at */}
        <div className='flex justify-end'>
          <p className='text-sm'>{ formatTimeAgo(chat.createdAt) }</p>
        </div>

        {/* topic */}
        <div className='flex justify-between'>
          {/* bubble */}
          <div className='
            rounded-full px-4 py-1 bg-stone-500
            text-xs font-medium text-white
          '>
            <span>{ chat.tag }</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Chat;