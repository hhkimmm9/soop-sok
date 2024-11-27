'use client';

import { Badge, } from '@mui/material';

import { useRouter, usePathname } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/utils/firebase/firebase';

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
    const { currentUser } = auth;
    const { publicChatURL, privateChatURL } = state;

    let redirectURL = '';

    if (pathname.includes('/chats/channel') || pathname.includes('/chats/chatroom')) {
      dispatch({ type: 'SET_PUBLIC_URL', payload: pathname });
    } else if (pathname.includes('/private-chats') || pathname.includes('/chats/private-chat')) {
      dispatch({ type: 'SET_PRIVATE_URL', payload: pathname });
    }

    const tabURLs: { [key: string]: string } = {
      'public-chat': publicChatURL || '/channels',
      'private-chat': privateChatURL || `/private-chats/${currentUser?.uid}`,
      'friends': '/friends',
      'settings': '/settings'
    };

    redirectURL = tabURLs[tab] || '';

    if (redirectURL) router.push(redirectURL);
  };
  
  return (
    <nav>
      {pathname !== '/' && (
        <div className='
          absolute bottom-0 w-full h-14 px-12
          flex justify-between items-center bg-earth-50
        '>
          {[
            { tab: 'public-chat', icon: <QueueListIcon className='h-5 w-5' />, badge: 1 },
            { tab: 'private-chat', icon: <ChatBubbleBottomCenterIcon className='h-5 w-5' />, badge: 2 },
            { tab: 'friends', icon: <UserIcon className='h-5 w-5' />, badge: 3 },
            { tab: 'settings', icon: <Cog6ToothIcon className='h-5 w-5' />, badge: 4 }
          ].map(({ tab, icon, badge }) => (
            <Badge key={tab} badgeContent={badge} color='primary'>
              <div onClick={() => redirectTo(tab)}
                className='
                  p-2 rounded-full
                  bg-earth-100 hover:bg-earth-200
                  transition duration-300 ease-in-out
              '>{icon}</div>
            </Badge>
          ))}
        </div>
      )}
    </nav>
  )
};

export default NavBar;