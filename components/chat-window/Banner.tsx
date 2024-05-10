'use client';

import { useState, useEffect } from 'react';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { collection, query, getDocs, where, } from 'firebase/firestore';

import { TBanner, FirestoreTimestamp } from '@/types';

import '@/components/Marquee.css';

const Banner = () => {
  const { state, dispatch } = useAppState();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const q = query(collection(db, 'banners'),
          where('selected', '==', true)
        );
  
        const bannerSnapshop = await getDocs(q);
        if (!bannerSnapshop.empty) {
          const selectedBanner = bannerSnapshop.docs[0].data() as TBanner;

          dispatch({ type: "SET_CURRENT_BANNER", currentBanner: selectedBanner });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanner();
  }, [dispatch]);

  return (
    <div className="h-min mt-1 py-2 rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="marquee w-screen">
        <span className="inline-block px-4">{ state.currentBanner?.content }</span>
      </div>
    </div>
  )
}

export default Banner