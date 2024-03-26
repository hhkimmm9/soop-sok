'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc, query,
  where,
  getDoc, getDocs, updateDoc, deleteDoc,
} from 'firebase/firestore';

const Page = () => {
  const params = useParams();
  const router = useRouter();

  var channelId: string | null = localStorage.getItem('channelId');

  const [signedInUser] = useAuthState(auth);

  const leaveChat = async () => {
    const channelRef = doc(db, 'channels', params.id.toString());

    const querySnapshot = await getDoc(channelRef);

    const data = querySnapshot.data()
    if (data) {
      await updateDoc(channelRef, {
        numUsers: data.numUsers - 1
      });
    }
    
    try {
      const statusRef = query(collection(db, 'status_board'),
        where('cId', '==', params.id),
        where('uId', '==', signedInUser?.uid)
      );
      const statusSnapshot = await getDocs(statusRef);

      if (!statusSnapshot.empty) {
        const deleteRef = doc(db, 'status_board', statusSnapshot.docs[0].id);
        await deleteDoc(deleteRef);
    
        const destination = params.type === 'lobby' ? '/channels' : `/chats/lobby/${channelId}`;
        router.push(destination);
      }
      // TODO: error handling
      else {
        // Handle case when no documents match the query
        // You might want to redirect or display a message to the user
      }
    } catch(error) {
      console.error('An error occurred:', error);
    }
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
          <div onClick={leaveChat}
            className='
              h-min py-8 flex justify-center items-center
              border border-black rounded-lg
          '>Leave</div>
        </div>
      </div>

      <Link href={`/chats/${params.type}/${params.id}`}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Cancel</Link>
    </div>
  )
}

export default Page