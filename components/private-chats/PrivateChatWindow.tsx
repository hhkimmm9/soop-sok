import { useAppState } from '@/utils/AppStateProvider';

import MessageContainer from '../MessageContainer';

const ChatWindow = () => {
  const { state } = useAppState();

  return (
    <div className='h-full p-4 flex flex-col gap-4 bg-stone-100'>
      <MessageContainer cid={state.privateChatId} />
    </div>
  )
};

export default ChatWindow;