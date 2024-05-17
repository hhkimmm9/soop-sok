import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

import { formatTimeAgo } from '@/utils/utils';
import { TChat } from '@/types'

type ChatProps = {
  chat: TChat,
};

const Chat = ({ chat }: ChatProps) => {

  const router = useRouter();

  const { state, dispatch } = useAppState();

  const enterChat = async () => {
    if (auth) {
      const statusRef = collection(db, 'status_board');
      try {
        await addDoc(statusRef, {
          cid: chat.id,
          displayName: auth.currentUser?.displayName,
          profilePicUrl: auth.currentUser?.photoURL,
          uid: auth.currentUser?.uid
        });
    
        router.push(`/chats/private-chat/${chat.id}`);
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'general' });
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: false });
      }
    }
  };

  return (
    <div onClick={enterChat} className='
      px-3 py-2 rounded-lg bg-stone-100
      flex flex-col gap-1
    '>
      {/* name */}
      <div>
        <p className='line-clamp-1'>{ chat.name }</p>
      </div>
      
      {/* chat info: created_at */}
      <div className='flex justify-end'>
        <p className='text-sm'>{ formatTimeAgo(chat.createdAt) }</p>
      </div>

      {/* topic, buttons */}
      <div className='h-6 flex justify-between'>
        { chat.tag.length > 0 && (
          // bubble
          <div className='
            rounded-full px-4 py-1 bg-amber-500
            text-xs text-white
          '>
            <span>{ chat.tag }</span>
          </div>
        )}
      </div>
    </div>
  )
};

export default Chat;