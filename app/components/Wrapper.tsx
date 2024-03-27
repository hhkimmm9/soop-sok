'use client';

import React from 'react';
import { useAppState } from '@/app/utils/AppStateProvider';
import InChannel from '@/app/components/InChannel';
import PrivateChats from '@/app/components/PrivateChats';

type WrapperProps = {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  const { state, dispatch } = useAppState();

  if (state.currentPage === 'in_channel') {
    return (
      <>
        <InChannel />
      </>
    )
  } else if (state.currentPage === 'private_chats') {
    return (
      <>
        <PrivateChats />
      </>
    )
  } else if (state.currentPage === 'pages') {
    return (
      <>
        { children }
      </>
    )
  }
};

export default Wrapper;