'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

import Banner from '@/app/components/Banner';
import ChatWindow from '@/app/components/chat-window/ChatWindow';

import { IMessage } from '@/app/interfaces';

const Chat = () => {
  // const [signedInUser, loading, error] = useAuthState(auth);

  const [messages, setMessages] = useState<IMessage[]>([]);

  const params = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    var messages: IMessage[] = []
    try {
      const q = query(collection(db, 'messages'), where('chatId', '==', params.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          chatId: doc.data().chatId,
          createdAt: doc.data().createdAt,
          sentBy: doc.data().sentBy,
          text: doc.data().text
          // ...doc.data()
        })
      });
      setMessages(messages);
    } catch (err) {
      console.error(err);
    };
  };

  return (
    <div className='flex flex-col gap-3'>
      <Banner />

      <ChatWindow
        type={searchParams.get('type')}
        messages={messages}
      />
    </div>
  )
};

export default Chat;