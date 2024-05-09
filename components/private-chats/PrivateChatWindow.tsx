import MessageContainer from '../MessageContainer';

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/utils/firebase';

const ChatWindow = () => {
  const { state } = useAppState();

  return (
    <div className='h-full flex flex-col gap-4'>
      <MessageContainer cid={state.privateChatId} />
    </div>
  )
};

export default ChatWindow;