'use client';

import { useEffect } from 'react';

import { useAppState } from '@/utils/AppStateProvider';

import '@/components/Marquee.css';
import { getBanner } from '@/db/utils';

const Banner = () => {
  const { state, dispatch } = useAppState();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await getBanner();
        dispatch({ type: 'SET_CURRENT_BANNER', payload: res });
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanner();
  }, [dispatch]);

  return (
    <div className='h-min mt-1 py-2 rounded-lg overflow-hidden shadow-sm bg-white'>
      <div className='marquee w-screen'>
        <span className='inline-block px-4'>{ state.currentBanner?.content }</span>
      </div>
    </div>
  )
};

export default Banner;