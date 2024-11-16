'use client';

import Friend from '@/app/friends/Friend';

import { useState, useEffect, } from 'react';

import { auth } from '@/db/firebase';
import { fetchFriends } from '@/db/utils';

import { TFriend } from '@/types';
import useDialogs from '@/functions/dispatcher';

const Friends = () => {
  const [friends, setFriends] = useState<TFriend[]>([]);

  const { messageDialog } = useDialogs();

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
        } catch (err) {
          console.error(err);
          messageDialog.show('data_retrieval');
        }
      }
    };
    fetchFriendList();
  }, [messageDialog]);

  return (
    <div className='h-full overflow-y-auto'>
      <h1 className='my-8 font-semibold text-3xl text-center text-earth-600'>Friends</h1>
      <div className='flex flex-col gap-2'>
        {friends.length > 0 ? friends.map((friend: TFriend) => (
          <Friend key={friend.id}
            friendId={auth.currentUser?.uid == friend.friendId
              ? friend.senderId
              : friend.friendId
          }/>
        )) : (
          <p>You have no friends. 😭 (just yet)</p>
        )}
      </div>
    </div>
  );
};

export default Friends;