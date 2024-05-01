'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
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

const Friend = ({ friendId }: FriendProps ) => {
  const [friend, setFriend] = useState<TUser>();
  
  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  const { dispatch } = useAppState();

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
    const myId = signedInUser?.uid;
    const opponentId = friendId;

    // check if their dm chat exists
    const q = query(collection(db, 'private_chats'),
      or(
        (where('from', '==', myId), where('to', '==', opponentId)),
        (where('to', '==', myId), where('from', '==', opponentId))
      ),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    // if it doesn't, create a dm chat room first
    if (querySnapshot.empty) {
      const docRef = await addDoc(collection(db, 'private_chats'), {
        from: myId,
        to: opponentId,
        createdAt: serverTimestamp(),
      });
      // redirect the user to the newly created dm chat room.
      dispatch({ type: 'SET_TO_PRIVATE_CHAT' })
      dispatch({ type: 'ENTER_PRIVATE_CHAT', privateChatId: docRef.id });
    } else {
      // redirect the user to the dm chat room.
      dispatch({ type: 'SET_TO_PRIVATE_CHAT' });
      dispatch({ type: 'ENTER_PRIVATE_CHAT', privateChatId: querySnapshot.docs[0].id });
    }

    router.push('/components');
  };

  if (friend) return (
    <div className='
      border border-black bg-white p-4 rounded-lg shadow-sm
      flex gap-4
    '>
      <Link href={`/profile/${friendId}`} className='flex items-center'>
        { friend?.photoURL !== undefined ? (
          <Image
            src={friend?.photoURL}
            alt=''
            width={1324}
            height={1827}
            className='object-cover w-12 h-12 rounded-full'
          />
        ) : (
          <Image
            src='https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/No%20Image.png?alt=media&token=18067651-9566-4522-bf2e-9a7963731676'
            alt=''
            width={1324}
            height={1827}
            className='object-cover w-12 h-12 rounded-full'
          />
        )} 
      </Link>

      <div className='grow grid grid-cols-6'>
        <div className='col-span-4'>
          {/* last signed in, where they are */}
          <p className='text-lg font-semibold'>{ friend.displayName }</p>
          <p>status: { friend.isOnline === true ? "Online" : "Offline" }</p>
          <p>Last login: { formatTimeAgo(friend?.lastLoginTime) }</p>
        </div>

        <div className='col-span-2 flex items-center justify-end'>
          <div onClick={redirectToDMChat} className='border rounded-full p-3'>
            <ChatBubbleBottomCenterIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Friend;