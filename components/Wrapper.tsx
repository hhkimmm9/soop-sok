'use client';

import React from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import Channels from '@/components/channels/Channels';
import PrivateChats from '@/components/private-chats/PrivateChats';
import NavBar from "@/components/NavBar";

type WrapperProps = {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  const { state } = useAppState();

  let content;

  switch (state.currentPage) {
    case 'channel':
      // TODO: change the URL
      content = <Channels />;
      break;
    case 'private_chat':
      // TODO: change the URL
      content = <PrivateChats />;
      break;
    case 'pages':
      content = children;
      break;
    default:
      content = null; // 예외 처리
  }

  return (
    <section className="
      relative mx-auto
      min-w-80 w-screen max-w-[430px]
      min-h-[667px] h-screen
      border border-black bg-white
    ">
      <main className='min-h-[calc(667px-3.5rem)] h-[calc(100vh-3.5rem)] px-4 pt-4 pb-6'>
        { content }
      </main>
      <NavBar />
    </section>
  )
};

export default Wrapper;