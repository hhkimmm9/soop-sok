'use client';

import { useState, useEffect } from 'react';

import PageTitle from '@/app/(components)/PageTitle';
import Friend from '@/app/(pages)/friends/Friend';
import { TFriend } from '@/types';
import { auth, firestore } from '@/utils/firebase/firebase';
import useDialogs from '@/utils/dispatcher';
import { collection, query, where, or } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

const Friends = () => {
  const [friends, setFriends] = useState<TFriend[]>([]);

  const { messageDialog } = useDialogs();

  const userId = auth.currentUser?.uid || '';

  const friendQuery = query(
    collection(firestore, 'friend_list'),
    or(
      where('senderId', '==', userId),
      where('friendId', '==', userId)
    )
  );

  const [snapshot, loading, error] = useCollection(friendQuery, {
    snapshotListenOptions: { includeMetadataChanges: true }
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    if (error) {
      console.error(error);
      messageDialog.show('data_retrieval');
      return;
    }

    if (snapshot && !loading) {
      const friends: TFriend[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TFriend));
      setFriends(friends);
    }
  }, [messageDialog, snapshot, loading, error, userId]);

  return (
    <div className='h-full overflow-y-auto'>
      <PageTitle title="Friends" />
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