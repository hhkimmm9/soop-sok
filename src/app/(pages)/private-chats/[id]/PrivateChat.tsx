import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { auth, firestore } from '@/utils/firebase/firebase';
import useDialogs from '@/utils/dispatcher'; // Adjust the import path as necessary

import { formatTimeAgo } from '@/utils/functions';
import { TMessage, TPrivateChat } from '@/types';

import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

type PrivateChatProps = {
  privateChat: TPrivateChat
};

const PrivateChat = ({ privateChat } : PrivateChatProps ) => {
  const [latestMessage, setLatestMessage] = useState<TMessage | null>(null);

  const router = useRouter();
  const { messageDialog } = useDialogs();

  const messageRef = query(
    collection(firestore, "messages"),
    where("cid", "==", privateChat.id),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const [snapshot, loading, error] = useCollection(messageRef, {
    snapshotListenOptions: { includeMetadataChanges: true }
  });

  useEffect(() => {
    if (snapshot && !loading) {
      const latestMessage = snapshot.empty ? [] : snapshot.docs.map(doc => doc.data());
      if (latestMessage.length > 0) {
        setLatestMessage(latestMessage[0] as TMessage || null);
      }
    }

    if (error) {
      console.error(error);
      messageDialog.show('data_retrieval');
    }
  }, [snapshot, loading, error, messageDialog]);

  // fetch the latest message associated with this private chat
  // to display when it is sent and the content of it.

  const enterPrivateChat = () => {
    if (auth && auth.currentUser) {
      router.push(`/chats/private-chat/${privateChat.id}`);
    }
  };

  if (latestMessage) return (
    <div onClick={enterPrivateChat}>
      <div className='
        p-4 rounded-lg shadow-sm bg-white
        flex gap-3 items-center
      '>
        <Image
          src={latestMessage.senderPhotoURL} alt=''
          width={1324} height={1827}
          className='object-cover w-16 h-16 rounded-full'
        />

        <div className='grow w-min'>
          <div className='flex justify-between'>
            {/* Sender's name. */}
            <p className='font-medium'>{ latestMessage.senderName }</p>

            {/* the time last message was received. */}
            { latestMessage && (
              <p>{ formatTimeAgo(latestMessage.createdAt) }</p>
            )}
          </div>

          {/* the content of the last message. */}
          <p className='mt-1 h-[3rem] overflow-hidden line-clamp-2'>
            { latestMessage.message }
          </p>
        </div>
      </div>
    </div>
  )
};

export default PrivateChat;