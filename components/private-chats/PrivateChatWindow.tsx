import { useAppState } from '@/utils/AppStateProvider';

import MessageContainer from '../MessageContainer';

const ChatWindow = () => {

  const { state } = useAppState();

  return (
    <div className='h-full flex flex-col gap-4'>
      <MessageContainer cid={state.privateChatId} />
    </div>
  )
};

export default ChatWindow;