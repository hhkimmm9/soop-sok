'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

const Page = () => {
  const params = useParams();
  const router = useRouter();

  var channelId: string | null = localStorage.getItem('channelId');

  const leaveChat = async () => {
    const channelRef = doc(db, 'channels', params.id.toString());

    const querySnapshot = await getDoc(channelRef);

    const data = querySnapshot.data()
    if (data) {
      await updateDoc(channelRef, {
        numUsers: data.numUsers - 1
      });
    }

    router.push(`${params.type == 'lobby' ?
      '/channels' : `/chats/lobby/${channelId}`}`
    )
  };

  return (
    <div className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto
        border border-black rounded-lg bg-white
      '>
        <div className='grid grid-cols-2 gap-4'>
          { params.type === 'lobby' && (
            <Link href={`/chats/${params.type}/${params.id}/create`}
              className='
                h-min py-8 flex justify-center items-center
                border border-black rounded-lg
            '>Create Chat</Link>
          ) }
          { params.type === 'lobby' && (
            <Link href={`/chats/${params.type}/${params.id}/chat-list`}
              className='
                h-min py-8 flex justify-center items-center
                border border-black rounded-lg
            '>Chat List</Link>
          ) }
          <Link href={`/chats/${params.type}/${params.id}/online-users`}
            className='
              h-min py-8 flex justify-center items-center
              border border-black rounded-lg
          '>User List</Link>
          { params.type != 'dm' && (
            <div onClick={leaveChat}
              className='
                h-min py-8 flex justify-center items-center
                border border-black rounded-lg
            '>Leave</div>
          )}
        </div>
      </div>

      <Link href={`/chats/${params.type}/${params.id}`}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Go Back</Link>
    </div>
  )
}

export default Page