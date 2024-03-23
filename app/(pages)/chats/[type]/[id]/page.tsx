'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc, query,
  where,
  addDoc, getDocs, onSnapshot, updateDoc,
  serverTimestamp, Unsubscribe
} from 'firebase/firestore';

import ChatMessage from '@/app/components/ChatMessage';
import MessageInput from '@/app/(pages)/chats/(components)/MessageInput';

import { TMessage } from '@/app/types';

const Chat = () => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [firestoreListener, setFirestoreListener] = useState<Unsubscribe>();
  const [activateUserInput, setActivateUserInput] = useState(false);
  const [channelId, setChannelId] = useState<string | null>('');

  const params = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      var messagesList: TMessage[] = [];
      try {
        const q = query(collection(db, 'messages'), where('chatId', '==', params.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          messagesList.push({
            id: doc.id,
            ...doc.data()
          } as TMessage)
        });
        setMessages(messagesList);
      } catch (err) {
        console.error(err);
      };
    };

    const initListner = async () => {
      // TODO: need to unsubscribe from this listner before this component is unmounted.
      var messagesList: TMessage[] = []
      const q = query(collection(db, 'messages'), where('chatId', '==', params.id));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          console.log(change)
          if (change.type === 'added') {
            messagesList.push({
              id: change.doc.id,
              ...change.doc.data()
            } as TMessage)
            setMessages(messagesList);
          }
          else if (change.type === 'removed') {
            console.log('removed')
          }
        });
      });
      return unsubscribe;
    };
  
    fetchMessages();
    const unsub = initListner();
    // return () => {
    //   console.log('triggered');
    //   // if (firestoreListener) firestoreListener();
    // }
  }, [params.id]);

  return (
    <div className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto
        border border-black rounded-lg bg-white
        flex flex-col gap-5
      '>
        { messages.map((message: TMessage) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>

      <div className=''>
        { activateUserInput || params.type === 'dm' ? (
          <div className=''>
            <MessageInput cancel={() => setActivateUserInput(false)} />
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-2'>
            <button onClick={() => setActivateUserInput(true)}
              className='bg-white border border-black py-2 rounded-lg shadow-sm
            '>Send a message</button>
            <Link href={`/chats/${params.type}/${params.id}/features`}
              className='bg-white border border-black py-2 rounded-lg shadow-sm text-center
            '>Other features</Link>
          </div>
        )}
      </div>
    </div>
  )
};

export default Chat;