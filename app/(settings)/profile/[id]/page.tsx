'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import OthersProfile from './OthersProfile';
import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/db/firebase';
import { fetchUser } from '@/db/utils';
import { TUser } from '@/types';

const Page = () => {
  // const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<TUser | null>(null);

  const { id } = useParams();
  
  const { dispatch } = useAppState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetchUser(id.toString());
        console.log(res);
  
        if (!res) {
          // Handle the case where the response is null
        } else {
          setProfile(res);
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });
      }
    };
  
    getUser();
  }, [dispatch, id, profile?.uid]);

  return (
    <div className='pt-10 flex flex-col gap-4'>
      {/* pic and name */}
      <div className='w-full grid grid-cols-4'>
        <div className='pl-2'>
          <Image
            src={profile?.photoURL || '/images/default-avatar.png'}
            alt='Profile Picture'
            width={128} height={128}
            className='cols-span-1 object-cover rounded-full'
          />
        </div>

        <div className='cols-span-3 pl-6 flex flex-col gap-3'>
          <p className='mx-auto font-medium text-3xl whitespace-nowrap'>
            { profile?.displayName || 'Anonymous' }
          </p>

          <p className='
            px-2 py-1 rounded-full bg-purple-300
            font-medium text-center uppercase text-white
          '>
            { profile?.profile?.mbti || 'N/A' }
          </p>
        </div>
      </div>

      { auth.currentUser?.uid == profile?.uid ? (
        // if the profile is the current user's profile
        <div className='w-full flex flex-col gap-8'>
          <Link href={`/profile/${profile?.uid}/edit`}
            className='border rounded-lg py-2 block shadow-sm text-center bg-white'
          > Edit Profile </Link>
        </div>
      ) : (
        // if the profile is not the current user's profile
        <OthersProfile profile={profile} />
      )}

      {/* introduction */}
      <div className='h-52 p-4 border rounded-lg overflow-y-auto bg-white'>
        <p>{ profile?.profile.introduction }</p>
      </div>
    </div>
  );
};

export default Page;