'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

import { formatTimeAgo } from '@/app/utils/utils';
import { IChat } from '@/app/interfaces'

const Chats = () => {
  // const [signedInUser, loading, error] = useAuthState(auth);

  const [chats, setChats] = useState<IChat[]>([]);

  const params = useParams();

  useEffect(() => {
    fetchChats();
  }, [])

  const fetchChats = async () => {
    var chats: IChat[] = [];
    try {
      const q = query(collection(db, 'chats'), where('channelId', '==', params.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        chats.push({
          id: doc.id,
          capacity: doc.data().capacity,
          channelId: doc.data().channelId,
          createdAt: doc.data().createdAt,
          name: doc.data().name,
          numUsers: doc.data().numUsers
          // ...doc.data()
        });
      });
      setChats(chats);
      console.log(chats)
    } catch (err) {
      console.error(err);
    };
  };

  return (
    <>
      { chats.map((chat: IChat) => (
        <div key={chat.id}>
          <Link href={`/chats/${chat.id}?type=chat`}>
            <div className='
              bg-white border border-black px-3 py-2 rounded-lg
              flex flex-col gap-1
            '>
              <div>
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
            </div>
          </Link>
        </div>
      )) }
    </>
  )
};

export default Chats;