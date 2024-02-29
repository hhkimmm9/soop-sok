'use client';

import { useParams, useSearchParams } from 'next/navigation';

import Banner from '@/app/components/Banner';
import ChatWindow from '@/app/components/chat-window/ChatWindow';

const Chat = () => {

  const params = useParams();
  // console.log(params.id);

  const searchParams = useSearchParams();
  // console.log(searchParams.get('type'));

  return (
    <div className='flex flex-col gap-3'>
      <Banner />

      <ChatWindow type={searchParams.get('type')}/>
    </div>
  )
};

export default Chat;