'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import Friend from '@/app/friends/Friend';

import { useState, useEffect, } from 'react';

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/db/firebase';
import { fetchFriends } from '@/db/utils';

import { TFriend } from '@/types';

const Friends = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<TFriend[]>([]);

  const { dispatch } = useAppState();

  useEffect(() => {
    const fetchFriendList = async () => {
      if (auth && auth.currentUser) {
        try {
          // const frsiendList: TFriend[] = [];
          const friends = await fetchFriends(auth.currentUser?.uid);
          if (friends) {
            // friends.forEach((doc: any) => {
            //   friendList.push({ id: doc.id, ...doc.data() } as TFriend);
            // });
            setFriends(friends);
          }
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });
        }
      }
    };
    fetchFriendList();
  }, [dispatch]);

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (
    <div className='flex flex-col gap-2'>
      { friends.length > 0 ? friends.map((friend: TFriend) => (
        <Friend key={friend.id}
          friendId={auth.currentUser?.uid == friend.friendId ?
            friend.senderId : friend.friendId
        }/>
      )) : (
        <p>You have no friends. 😭 (just yet)</p>
      ) }
    </div>
  );
};

export default Friends;