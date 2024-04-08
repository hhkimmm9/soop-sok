'use client';

import { useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';

const Page = () => {
  const { dispatch } = useAppState();

  useEffect(() => {
    dispatch({ type: 'SET_TO_CHANNEL' });
  }, []);

  return (
    <></>
  )
}

export default Page