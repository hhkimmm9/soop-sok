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

  const renderComponent = (page: string) => {
    switch (page) {
      case "channels":
        dispatch({ type: 'SET_TO_CHANNEL' });
        router.push('/components');
        break;

      case "private_chats":
        dispatch({ type: 'SET_TO_PRIVATE_CHAT' });
        router.push('/components');
        break;

      case "/friends":
        dispatch({ type: 'SET_TO_PAGES' });
        router.push(page);
        break;

      case "/settings":
        dispatch({ type: 'SET_TO_PAGES' });
        router.push(page);
        break;

      default:
        break;
    }
  };
  
  return (
    <nav>
      { pathname !== '/'  && (
        <div className="
          absolute bottom-0 w-full h-14 px-12 bg-yellow-900
          flex justify-between items-center
        ">
          {/* Channels */}
          <div onClick={() => renderComponent('channels')}
            className="p-2 rounded-full border border-yellow-700 bg-yellow-500 hover:bg-yellow-700"
          >
            <QueueListIcon className='h-5 w-5' />
          </div>

          {/* Private chats */}
          <div onClick={() => renderComponent('private_chats')}
            className="p-2 rounded-full border border-yellow-700 bg-yellow-500 hover:bg-yellow-700"
          >
            <ChatBubbleBottomCenterIcon className='h-5 w-5' />
          </div>

          {/* Friends List */}
          <div onClick={() => renderComponent('/friends')}
            className="p-2 rounded-full border border-yellow-700 bg-yellow-500 hover:bg-yellow-700"
          >
            <UserIcon className='h-5 w-5' />
          </div>

          {/* Settings */}
          <div onClick={() => renderComponent('/settings')}
            className="p-2 rounded-full border border-yellow-700 bg-yellow-500 hover:bg-yellow-700"
          >
            <Cog6ToothIcon className='h-5 w-5' />
          </div>
        </div> 
      )}
    </nav>
  )
};

export default NavBar;