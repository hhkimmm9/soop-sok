'use client';

import React from 'react';
import { useAppState } from '@/app/utils/AppStateProvider';
import InChannel from '@/app/components/InChannel';
import PrivateChats from '@/app/components/PrivateChats';

type WrapperProps = {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  const { state } = useAppState();

  let content;

  switch (state.currentPage) {
    case 'in_channel':
      content = <InChannel />;
      break;
    case 'private_chats':
      content = <PrivateChats />;
      break;
    case 'pages':
      content = children;
      break;
    default:
      content = null; // 예외 처리
  }

  return (
    <main className="h-[calc(100vh-3.5rem)] px-4 pt-4 pb-6">
      { content }
    </main>
  )
};

export default Wrapper;