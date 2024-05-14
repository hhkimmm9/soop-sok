'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { auth, db } from '@/utils/firebase';
import {
  collection, doc, query,
  or, where, limit,
  addDoc, getDoc, getDocs,
  serverTimestamp
} from 'firebase/firestore';

import { TUser } from '@/types';
import { formatTimeAgo } from '@/utils/utils';

import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

type FriendProps = {
  friendId: string
};

const NO_PIC_PLACEHOLDER = "https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/No%20Image.png?alt=media&token=18067651-9566-4522-bf2e-9a7963731676";

const Friend = ({ friendId }: FriendProps ) => {
  const [friend, setFriend] = useState<TUser>();

  const router = useRouter();

  useEffect(() => {
    const fetchFriend = async () => {
      const q = doc(db, "users", friendId);
      const snapshot = await getDoc(q);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setFriend(data as TUser);
      }
    };
    fetchFriend();
  }, [friendId]);
  
  const redirectToDMChat = async () => {
    const myId = auth.currentUser?.uid;
    const opponentId = friendId;

    // check if their dm chat exists
    const q = query(collection(db, 'private_chats'),
      or(
        (where("from", "==", myId), where("to", "==", opponentId)),
        (where("from", "==", opponentId), where("to", "==", myId)),
      )
    );
    const querySnapshot = await getDocs(q);

    // if it doesn't, create a dm chat room first
    if (querySnapshot.empty) {
      const chatRef = await addDoc(collection(db, 'private_chats'), {
        from: myId,
        to: opponentId,
        createdAt: serverTimestamp(),
      });
      // redirect the user to the newly created dm chat room.
      router.push(`/chats/private-chat/${chatRef.id}`);
    } else {
      // redirect the user to the dm chat room.
      router.push(`/chats/private-chat/${querySnapshot.docs[0].id}`);
    }
  };

  if (friend) return (
    <div className='p-5 rounded-lg shadow-md bg-white flex gap-4'>
      <Link href={`/profile/${friendId}`} className='flex items-center'>
        { friend?.photoURL !== undefined ? (
          <Image src={friend?.photoURL} alt=''
            width={1324} height={1827} className='object-cover w-12 h-12 rounded-full'
          />
        ) : (
          <Image
            src={NO_PIC_PLACEHOLDER}
            alt=''
            width={1324} height={1827}
            className='object-cover w-12 h-12 rounded-full'
          />
        )} 
      </Link>

      <div className='grow grid grid-cols-6'>
        <div className='col-span-4'>
          {/* last signed in, where they are */}
          <div className='flex gap-4 items-center'>
            <p className='text-lg font-semibold'>{ friend.displayName }</p>
            { friend.isOnline === true ? (
              <p className='px-2 rounded-full bg-lime-400'>Online</p>
            ) : (
              <p className='px-2 rounded-full bg-red-400'>Offline</p>
            )}
            
          </div>
          <p>Last login: { formatTimeAgo(friend?.lastLoginTime) }</p>
        </div>

        <div className='col-span-2 flex items-center justify-end'>
          <div onClick={redirectToDMChat} className='p-3 rounded-full border'>
            <ChatBubbleBottomCenterIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Friend;