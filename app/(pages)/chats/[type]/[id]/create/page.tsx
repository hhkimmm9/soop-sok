'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import CreateChat from '@/app/components/CreateChat';

const CreateChatPage = () => {
  const params = useParams();

  const createChatRoom = async () => {
    console.log('click createChatRoom');
    // if (auth.currentUser) {
    //   const uid = auth.currentUser.uid;
  
    //   const chatRef = await addDoc(collection(db, 'chats'), {
    //     capacity: ,
    //     createdAt: serverTimestamp(),
    //     sentBy: uid,
    //     text: messageInput
    //   })
    // };
  };

  return (
    <>
      <div className='
        grow p-4 overflow-y-auto
        border border-black rounded-lg bg-white
        flex flex-col gap-3
      '>
        <CreateChat
          toggleState={() => {}}
        />
      </div>

      <div className='grid grid-cols-2 gap-2.5'>
        <Link href={`/chats/${params.type}/${params.id}/features`}
          className='
          w-full py-2 bg-white
          border border-black rounded-lg shadow-sm text-center
        '>Go Back</Link>
        
        <button onClick={() => createChatRoom()}
          className='
          w-full py-2 bg-white
          border border-black rounded-lg shadow-sm
        '>Create</button>
      </div>
    </>
  )
};

export default CreateChatPage;