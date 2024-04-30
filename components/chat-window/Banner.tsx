'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { collection, query, getDocs, where, } from 'firebase/firestore';
import { FirestoreTimestamp } from '@/types';

import '@/components/Marquee.css';

type TBanner = {
  cid: string;
  content: string;
  createdAt: FirestoreTimestamp;
  selected: boolean;
  tagOptions: string[];
};

const Banner = () => {
  const [banner, setBanner] = useState<TBanner | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const q = query(collection(db, 'banners'),
          where('selected', '==', true)
        );
  
        const bannerSnapshop = await getDocs(q);
        if (!bannerSnapshop.empty) {
          const selectedBanner = bannerSnapshop.docs[0].data() as TBanner;
          setBanner(selectedBanner);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanner();
  }, []);

  return (
    <div className="
      h-min mt-1 py-2 overflow-hidden
      border border-black rounded-lg bg-white
      text-black  
    ">
      <div className="marquee w-screen">
        <span className="inline-block px-4">{ banner?.content }</span>
      </div>
    </div>
  )
}

export default Banner