'use client';

import ProfileHeader from './ProfileHeader';
import ProfileButtonGroup from './ProfileButtonGroup';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
// import { auth } from '@/db/firebase';
import { fetchUser } from '@/db/utils';

import { TUser } from '@/types';

const Page = () => {
  // const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<TUser | null>(null);

  const { id } = useParams();
  
  const { dispatch } = useAppState();

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {
      try {
        const res = await fetchUser(id.toString());
        console.log(res);
  
        if (!res) {
          // 
        }
  
        if (isMounted) {
          setProfile(res);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, [dispatch, id]);

  return (
    <ProfileHeader profile={profile}>
      <ProfileButtonGroup profile={profile} />
    </ProfileHeader>
  );
};

export default Page;