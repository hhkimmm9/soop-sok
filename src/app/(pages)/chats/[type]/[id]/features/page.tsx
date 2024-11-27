'use client';

import { useRouter } from 'next/navigation';
import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/utils/firebase/firebase';
import { updateChannel, updateChat } from '@/utils/firebase/firestore/services';
import useDialogs from '@/utils/dispatcher';
import {
  PlusIcon,
  MegaphoneIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UsersIcon,
  ArrowLeftStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

type TFeatures = 'create-chat' | 'add-banner' | 'chat-list' | 'user-list' | 'cancel';

type PageProps = {
  params: {
    type: string;
    id: string;
  };
};

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const { state } = useAppState();
  const { channelState } = useDialogs();

  const redirectTo = (feature: TFeatures) => {
    if (auth) {
      const path = feature === 'cancel' ? '' : `/${feature}`;
      router.push(`/chats/${params.type}/${params.id}${path}`);
    }
  };

  const handleLeave = async () => {
    const currentUserId = auth.currentUser?.uid;
    if (currentUserId) {
      const leaveAction = params.type === 'channel' ? updateChannel : updateChat;
      const res = await leaveAction(params.id, currentUserId, 'leave');

      if (params.type === 'channel') {
        channelState.set(null);
        if (res) router.push('/channels');
      } else if (params.type === 'chatroom' && res) {
        router.push(`/chats/channel/${state.channelId}`);
      }
    }
  };

  const features = [
    { feature: 'create-chat', Icon: PlusIcon, text: 'Create Chat' },
    { feature: 'add-banner', Icon: MegaphoneIcon, text: 'Add Banner' },
    { feature: 'chat-list', Icon: ChatBubbleOvalLeftEllipsisIcon, text: 'Chat List' },
  ];

  return (
    <div className='h-full flex flex-col gap-4 py-8'>
      <div className='grow flex flex-col gap-4 rounded-lg overflow-y-auto'>
        {params.type === 'channel' &&
          features.map(({ feature, Icon, text }) => (
            <div
              key={feature}
              onClick={() => redirectTo(feature as TFeatures)}
              className='py-5 flex justify-center items-center gap-4 rounded-lg bg-earth-50 transition duration-300 ease-in-out hover:bg-earth-100'
            >
              {/* <Icon className='h-7' /> */}

              {/* TODO: need some thick ass font  */}
              <p className='font-semibold text-lg text-earth-500'>{text}</p>
            </div>
          ))}

        <div
          onClick={() => redirectTo('user-list')}
          className='py-5 flex justify-center items-center gap-4 rounded-lg bg-earth-50 transition duration-300 ease-in-out hover:bg-earth-100'
        >
          {/* <UsersIcon className='h-7' /> */}

          {/* TODO: need some thick ass font  */}
          <p className='font-semibold text-lg text-earth-500'>User List</p>
        </div>

        {(params.type === 'channel' || params.type === 'chatroom') && (
          <div
            onClick={handleLeave}
            className='py-5 flex justify-center items-center gap-4 rounded-lg bg-earth-50 transition duration-300 ease-in-out hover:bg-earth-100'
          >
            {/* <ArrowLeftStartOnRectangleIcon className='h-7' /> */}

            {/* TODO: need some thick ass font  */}
            <p className='font-semibold text-lg text-earth-500'>Leave</p>
          </div>
        )}
      </div>

      <button
        type='button'
        onClick={() => redirectTo('cancel')}
        className='w-full py-4 rounded-lg shadow-sm bg-earth-50 font-semibold text-lg text-earth-500 hover:bg-earth-100 transition duration-300 ease-in-out'
      >
        Cancel
      </button>
    </div>
  );
};

export default Page;
