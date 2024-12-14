import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/utils/firebase/firebase';

import { formatTimeAgo } from '@/utils/functions';
import { TMessage, TPrivateChat, TUser } from '@/types';

type PrivateChatProps = {
  privateChat: TPrivateChat
};

const PrivateChat = ({ privateChat } : PrivateChatProps ) => {
  const [latestMessage, setLatestMessage] = useState<TMessage | null>(null);

  const router = useRouter();

  const { state, dispatch } = useAppState();

  const messageRef = firestore.collection("messages").where("cid", "==", cid).orderBy("createdAt", "desc").limit(1);
  const [snapshot, loading, error] = useCollection(messageRef);

  useEffect(() => {
    if (snapshot && !loading) {
      const latestMessage = snapshot.empty ? [] : snapshot.docs.map(doc => doc.data());
      if (latestMessage.length > 0) {
        setLatestMessage(latestMessage);
      }
    }

    if (error) {
      console.error(error);
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });
    }
  }, [snapshot, loading, error, setLatestMessage, dispatch]);

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