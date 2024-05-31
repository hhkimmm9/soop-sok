'use client';

import { useRouter } from 'next/navigation';

import { auth } from '@/db/firebase';
import { leaveChannel, leaveChat } from '@/db/utils';

import {
  PlusIcon,
  MegaphoneIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UsersIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

type TFeatures = (
  | 'create-chat'
  | 'add-banner'
  | 'chat-list'
  | 'user-list'
  | 'cancel'
);

type pageProps = {
  params: {
    type: string,
    id: string
  }
};

const Page = ({ params }: pageProps) => {
  const router = useRouter();

  const redirectTo = (feature: TFeatures) => {
    if (auth) feature == 'cancel' ?
      router.push(`/chats/${params.type}/${params.id}`) :
      router.push(`/chats/${params.type}/${params.id}/${feature}`);
  };

  const handleLeave = async () => {
    if (auth && auth.currentUser) {
      if (params.type == 'chatroom') {
        const res = await leaveChat(params.id, auth.currentUser.uid);

        if (res) router.push(`/chats/channel-chat/${params.id}`);
      }
      // If you were in a channel, leave the channel.
      else if (params.type == 'channel'){
        const res = await leaveChannel(params.id, auth.currentUser.uid);

        if (res) router.push('/channels');
      }
    }
  };

  return (
    <div className='h-full flex flex-col gap-4'>
      <div className='grow p-4 rounded-lg overflow-y-auto bg-white'>
        <div className='flex flex-col gap-4'>
          { params.type === 'public-chat' && (
            <>
              {/* Create Chat */}
              <div onClick={() => redirectTo('create-chat')}
                className='
                  py-6 rounded-lg bg-stone-100
                  transition duration-300 ease-in-out hover:bg-stone-200
                  flex justify-center'
              > <PlusIcon className='h-8' /> </div>
    
              {/* Add Banner */}
              <div onClick={() => redirectTo('add-banner')}
                className='
                  py-6 rounded-lg bg-stone-100
                  transition duration-300 ease-in-out hover:bg-stone-200
                  flex justify-center'
              > <MegaphoneIcon className='h-8' /> </div>
    
              {/* Chat List */}
              <div onClick={() => redirectTo('chat-list')}
                className='
                  py-6 rounded-lg bg-stone-100
                  transition duration-300 ease-in-out hover:bg-stone-200
                  flex justify-center'
              > <ChatBubbleOvalLeftEllipsisIcon className='h-8' /> </div>
            </>
          )}

          {/* User List */}
          <div onClick={() => redirectTo('user-list')}
            className='
              py-6 rounded-lg bg-stone-100
              transition duration-300 ease-in-out hover:bg-stone-200
              flex justify-center'
          > <UsersIcon className='h-8' /> </div>

          { params.type === 'public-chat' && (  
            <div onClick={handleLeave}
              className='
                py-6 rounded-lg bg-stone-100
                transition duration-300 ease-in-out hover:bg-stone-200
                flex justify-center'
            > <ArrowLeftStartOnRectangleIcon className='h-8' /> </div>
          )}
        </div>
      </div>

      {/* Cancel: go back to messages container. */}
      <button type='button' onClick={() => redirectTo('cancel')}
        className='
          w-full py-4 rounded-lg shadow-sm bg-white
          hover:bg-stone-200 transition duration-300 ease-in-out
        '
      > Cancel </button>
    </div>
  );
};

export default Page;