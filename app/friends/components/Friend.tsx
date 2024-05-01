'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { auth, db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { TUser } from '@/types';
import { formatTimeAgo } from '@/utils/utils';

type FriendProps = {
  friendId: string
};

const Friend = ({ friendId }: FriendProps ) => {
  const [friend, setFriend] = useState<TUser>();

  useEffect(() => {
    const fetchFriend = async () => {
      const q = doc(db, "users", friendId);
      const snapshot = await getDoc(q);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setFriend(data as TUser);
        console.log(data)
      }
    };
    fetchFriend();
  }, [friendId]);


  if (friend) return (
    <Link href={`/profile/${friendId}`}
      className='
        border border-black bg-white p-4 rounded-lg shadow-sm
        flex gap-3
    '>
      { friend?.photoURL !== undefined ? (
        <Image
          src={friend?.photoURL}
          alt=''
          width={1324}
          height={1827}
          className='
            object-cover
            w-12 h-12
            rounded-full
        '/>
      ) : (
        <Image
          src='https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/No%20Image.png?alt=media&token=18067651-9566-4522-bf2e-9a7963731676'
          alt=''
          width={1324}
          height={1827}
          className='
            object-cover
            w-12 h-12
            rounded-full
        '/>
      )} 

      <div>
        {/* last signed in, where they are */}
        <p className='text-lg font-semibold'>{ friend.displayName }</p>
        <p>status: { friend.isOnline === true ? "Online" : "Offline" }</p>
        <p className='text-right'>Last login: { formatTimeAgo(friend?.lastLoginTime) }</p>
      </div>
    </Link>
  )
};

export default Friend;