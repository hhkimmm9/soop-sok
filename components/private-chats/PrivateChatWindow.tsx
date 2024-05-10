import MessageContainer from '../chat-window/MessageContainer';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/utils/firebase';

const ChatWindow = () => {
  const { state } = useAppState();

  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.push('/');
      return;
    }
  }, [auth]);

  return (
    <div className='h-full p-4 flex flex-col gap-4 bg-stone-100'>
      <MessageContainer cid={state.privateChatId} />
    </div>
  )
};

export default ChatWindow;