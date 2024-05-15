'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import MUIMessageDialog from '@/components/MUIMessageDialog';
import Friend from '@/app/friends/Friend';

import { useState, useEffect, } from 'react';

import { auth, db } from '@/utils/firebase';
import { query, collection, getDocs, or, where, } from 'firebase/firestore';

import {
  DATA_RETRIEVAL_TITLE, DATA_RETRIEVAL_CONTENT,
} from '@/utils/messageTexts';

type TFriend = {
  id: string;
  receiverId: string;
  senderId: string;
};

const Friends = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessageTitle, setErrorMessageTitle] = useState('');
  const [errorMessageContent, setErrorMessageContent] = useState('');

  const [friends, setFriends] = useState<TFriend[]>([]);

  useEffect(() => {
    const fetchFriendList = async () => {
      if (auth && auth.currentUser) {
        const q = query(collection(db, 'friend_list'),
          or(
            where('senderId', '==', auth.currentUser?.uid),
            where('receiverId', '==', auth.currentUser?.uid),
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
            setFriends(friendList);
          }
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setErrorMessageTitle(DATA_RETRIEVAL_TITLE);
          setErrorMessageContent(DATA_RETRIEVAL_CONTENT);
          setShowMessage(true);
        }
      }
    };
    fetchFriendList();
  }, []);

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (<>
    <div className='flex flex-col gap-2'>
      { friends.length > 0 ? friends.map((friend: TFriend) => (
        <Friend key={friend.id} friendId={auth.currentUser?.uid == friend.receiverId ? friend.senderId : friend.receiverId} />
      )) : (
        <p>You have no friends. 😭 (just yet)</p>
      ) }
    </div>

    <MUIMessageDialog
      show={showMessage}
      title={errorMessageTitle}
      message={errorMessageContent}
      handleClose={() => { setShowMessage(false) }}
    />
  </>)
};

export default Friends;