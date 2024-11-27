import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, firestore } from '@/utils/firebase/firebase';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { updateChat } from '@/utils/firebase/firestore/services';

import { formatTimeAgo } from '@/utils/functions';
import { TChat } from '@/types'

type ChatProps = {
  chat: TChat
};

const Chat = ({ chat }: ChatProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFull, setIsFull] = useState(false);
  
  const router = useRouter();

  const { dispatch } = useAppState();

  // Authorize users before rendering the page.
  useEffect(() => {
    if (!auth) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch channle data in real time only if a user is authorized.
  const chatRef = doc(firestore, 'chats', chat.id);
  const [FSValue, FSLoading, FSError] = useDocumentData(
    isAuthenticated ? chatRef : null
  );

  useEffect(() => {
    if (FSValue?.numMembers < FSValue?.capacity) {
      setIsFull(false)
    }
  }, [FSValue]);

  // Error: real time data fetching
  useEffect(() => {
    if (FSError !== undefined) {
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });
      router.refresh();
    }
  }, [FSError, dispatch, router]);

  const handleEnterChat = async () => {
    // Authorize users.
    if (auth && auth.currentUser && !isFull) {
      try {
        const res = await updateChat(chat.id, auth.currentUser.uid, 'enter');

        if (res) router.push(`/chats/chatroom/${chat.id}`); 
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'general' } });
      }
    }
  };

  return (
    <div onClick={handleEnterChat} className='
      px-3 py-2 rounded-lg bg-stone-100
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
      <div className='h-6 flex justify-between'>
        { chat.tag.length > 0 && (
          // bubble
          <div className='
            rounded-full px-4 py-1 bg-amber-500
            text-xs text-white
          '>
            <span>{ chat.tag }</span>
          </div>
        )}
      </div>
    </div>
  )
};

export default Chat;