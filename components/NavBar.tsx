'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAppState } from '@/utils/AppStateProvider';

import {
  QueueListIcon,
  ChatBubbleBottomCenterIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { dispatch } = useAppState();

  const activateChats = (type: string) => {
    router.push('/components');
    if (type === 'channels') {
      dispatch({ type: 'SET_TO_CHANNEL' });
    }
    else if (type === 'private_chats') {
      dispatch({ type: 'SET_TO_PRIVATE_CHAT' });
    }
  };

  const activateRegularPage = (url: string) => {
    dispatch({ type: 'SET_TO_PAGES' });

    // TODO: may need to push after the url changed.
    router.push(url);
  };
  
  return (
    <>
      { pathname !== '/'  && (
        <div className="
          absolute bottom-0 w-full h-14
          border-t border-black
          px-12 flex justify-between items-center
        ">
          {/* Channels */}
          <div onClick={() => activateChats('channels')}
            className="rounded-full px-3
          ">
            <QueueListIcon className='h-5 w-5' />
          </div>

          {/* Private chats */}
          <div onClick={() => activateChats('private_chats')}
            className="rounded-full px-3
          ">
            <ChatBubbleBottomCenterIcon className='h-5 w-5' />
          </div>

          {/* Friends List */}
          <div onClick={() => activateRegularPage('/friends')}
            className="rounded-full px-3
          ">
            <UserIcon className='h-5 w-5' />
          </div>

          {/* Settings */}
          <div onClick={() => activateRegularPage('/settings')}
            className="rounded-full px-3
          ">
            <Cog6ToothIcon className='h-5 w-5' />
          </div>
        </div> 
      )}
    </>
  )
};

export default NavBar;