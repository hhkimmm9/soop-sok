"use client";

import Banner from "@/components/chat-window/Banner";
import MessageContainer from "@/components/chat-window/MessageContainer";
import MessageInput from '@/components/chat-window/MessageInput';
import IconBesideInputContainer from "../../_components/IconBesideInputContainer";

interface ChatPageProps {
  params: {
    type: string
    id: string
  }
};

const ChatPage = ({ params }: ChatPageProps) => {
  return (
    <div className='h-full grid grid-rows-12'>
      {(params.type === 'channel' || params.type === 'chatroom') && <Banner />}

      <div className={`
        h-full flex flex-col gap-4
        ${(params.type === 'channel' || params.type === 'chatroom')
          // If this is either a channel chat or general chat in a channel, show the banner.
          ? 'row-start-2 row-span-11'
          // Otherwise no banner.
          : 'row-start-1 row-span-12'
        }
      `}>
        <MessageContainer type={params.type} cid={params.id} />

        {/* features / leave and message input container */}
        <div className='flex justify-between gap-3'>
          <IconBesideInputContainer type={params.type} cid={params.id} />
          <MessageInput cid={params.id} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;