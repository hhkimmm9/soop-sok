'use client';

import { Badge, } from '@mui/material';

import { useRouter, usePathname } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/db/firebase';

import {
  QueueListIcon,
  ChatBubbleBottomCenterIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { state, dispatch } = useAppState();

  const redirectTo = (tab: string) => {
    let redirectURL: string | null = null;
  
    // Set the redirectURL based on the current pathname
    if (pathname.includes('/channels') || pathname.includes('/chats/channel') || pathname.includes('/chats/chatroom')) {
      dispatch({ type: 'SET_PUBLIC_URL', payload: pathname });
      redirectURL = '/channels';
    } else if (pathname.includes('/private-chats') || pathname.includes('/chats/private-chat')) {
      dispatch({ type: 'SET_PRIVATE_URL', payload: pathname });
      redirectURL = `/private-chats/${auth.currentUser?.uid}`;
    }
  
    // Determine the final redirectURL based on the requested URL
    switch (tab) {
      case 'public-chat':
        redirectURL = state.publicChatURL !== '' ? state.publicChatURL : '/channels';
        break;
      case 'private-chat':
        redirectURL = state.privateChatURL !== '' ? state.privateChatURL : `/private-chats/${auth.currentUser?.uid}`;
        break;
      case 'friends':
        redirectURL = '/friends';
        break;
      case 'settings':
        redirectURL = '/settings';
        break;
      default:
        break;
    }
  
    // Perform the redirection
    if (redirectURL) router.push(redirectURL);
  };
  
  return (
    <nav>
      { pathname !== '/'  && (
        <div className='
          absolute bottom-0 w-full h-14 px-12 bg-yellow-900
          flex justify-between items-center
        '>
          {/* Channels */}
          <div onClick={() => redirectTo('public-chat')}
            className='p-2 rounded-full border border-yellow-700 bg-yellow-500 hover:bg-yellow-700'
          >
            <QueueListIcon className='h-5 w-5' />
          </div>

          {/* Private chats */}
          <Badge badgeContent={256} color='primary'>
            <div onClick={() => redirectTo('private-chat')}
              className='p-2 rounded-full border border-yellow-700 bg-yellow-500 hover:bg-yellow-700'
            >
              <ChatBubbleBottomCenterIcon className='h-5 w-5' />
            </div>
          </Badge>

          {/* Friends List */}
          <Badge badgeContent={1} color='primary'>
            <div onClick={() => redirectTo('friends')}
              className='p-2 rounded-full border border-yellow-700 bg-yellow-500 hover:bg-yellow-700'
            >
              <UserIcon className='h-5 w-5' />
            </div>
          </Badge>

          {/* Settings */}
          <div onClick={() => redirectTo('settings')}
            className='p-2 rounded-full border border-yellow-700 bg-yellow-500 hover:bg-yellow-700'
          >
            <Cog6ToothIcon className='h-5 w-5' />
          </div>
        </div> 
      )}
    </nav>
  )
};

export default NavBar;