'use client';

import { useEffect } from 'react';

import { useAppState } from '@/utils/AppStateProvider';
import useDialogs from '@/functions/dispatcher';

import '@/components/Marquee.css';
import { getBanner } from '@/db/services';

const Banner = () => {
  const { state } = useAppState();
  const { bannerState } = useDialogs();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await getBanner();
        bannerState.set(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanner();
  }, [bannerState]);

  return (
    <div className='h-min py-2 rounded-lg overflow-hidden bg-white'>
      <div className='marquee'>
        <p className='inline-block px-4'>{state.currentBanner?.content}</p>
      </div>
    </div>
  )
};

export default Banner;