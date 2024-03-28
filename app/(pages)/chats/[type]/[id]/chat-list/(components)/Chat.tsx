'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc,
  addDoc, updateDoc,
} from 'firebase/firestore';

import { formatTimeAgo } from '@/app/utils/utils';
import { TChat } from '@/app/types'

type ChatProps = {
  chat: TChat
};

const Chat = ({ chat }: ChatProps) => {
  const params = useParams();
  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  const enterChat = async () => {
    // store channel id
    localStorage.setItem('channelId', params.id.toString());

    const statusRef = collection(db, 'status_board');
    await addDoc(statusRef, {
      cid: chat.id,
      displayName: signedInUser?.displayName,
      profilePicUrl: signedInUser?.photoURL,
      uid: signedInUser?.uid
    });

    router.push(`/chats/chat/${chat.id}`);
  };

  return (
    <div onClick={enterChat} className='
      bg-white border border-black px-3 py-2 rounded-lg
      flex flex-col gap-1
    '>
      {/* name */}
      <div>
        <p className='line-clamp-1'>{ chat.name }</p>
      </div>
      
      {/* chat info: created_at */}
      <div className='flex justify-end'>
        <p className='text-sm'>{ formatTimeAgo(chat.createdAt) }</p>
      </div>

      {/* topic, buttons */}
      <div className='flex justify-between'>
        {/* bubble */}
        <div className='
          rounded-full px-4 py-1 bg-amber-500
          text-xs text-white
        '>
          <span>whatever</span>
        </div>
      </div>
    </div>
  )
};

export default Chat;