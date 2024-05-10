'use client';

import Friend from '@/app/friends/Friend';

import { useState, useEffect, } from 'react';

import { auth, db } from '@/utils/firebase';
import {
  doc, query, collection,
  setDoc, getDocs, updateDoc,
  or, where, serverTimestamp
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { TUser } from '@/types';

type TFriend = {
  id: string;
  receiverId: string;
  senderId: string;
};

const Friends = () => {
  const [friends, setFriends] = useState<TFriend[]>([]);

  const [signedInUser] = useAuthState(auth);

  useEffect(() => {
    const fetchFriendList = async () => {
      if (signedInUser) {
        const q = query(collection(db, "friend_list"),
          or(
            where("senderId", "==", signedInUser?.uid),
            where("receiverId", "==", signedInUser?.uid),
          )
        );
  
        try {
          const friendList: TFriend[] = [];
          const friendsSnapshot = await getDocs(q);
          if (!friendsSnapshot.empty) {
            const data = friendsSnapshot.forEach((doc) => {
              friendList.push({
                id: doc.id,
                ...doc.data()
              } as TFriend)
            });

            setFriends(friendList)
;
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchFriendList();
  }, [signedInUser]);

  return (
    <div className='flex flex-col gap-2'>
      { friends.map((friend: TFriend) => (
        <Friend key={friend.id} friendId={signedInUser?.uid == friend.receiverId ? friend.senderId : friend.receiverId} />
      )) }
    </div>
  )
}

export default Friends