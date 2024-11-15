import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/db/firebase';
import { checkIsMyFriend, makeFriend } from '@/db/utils';
import {
  collection, query, where,
  addDoc, getDocs, serverTimestamp
} from 'firebase/firestore';
import { TUser } from '@/types';

const OthersProfile = ({ profile }: { profile: TUser | null }) => {
  const [isMyFriend, setIsMyFriend] = useState(false);

  const router = useRouter();

  const { dispatch } = useAppState();

  useEffect(() => {

    const initCheckIsMyFriend= async () => {
      if (auth && auth.currentUser && profile?.uid) {
        try {
          const friends = await checkIsMyFriend(auth.currentUser?.uid, profile.uid);
          if (friends) {
            setIsMyFriend(true);
          }
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_retrieval' } });
        }
      }
    };
    
    initCheckIsMyFriend();
  }, [dispatch, profile?.uid]);

  const redirectToDMChat = async () => {
    const myId = auth.currentUser?.uid;
    const opponentId = profile?.uid;

    // check if their dm chat exists
    const privateChatRef = collection(db, 'private_chats');
    const q = query(privateChatRef,
      where('from', 'in', [myId, opponentId]),
      where('to', 'in', [myId, opponentId])
    );

    try {
      // TODO: add havePrivateChat to friend_list
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // TODO: createPrivateChat
        const chatRef = await addDoc(privateChatRef, {
          from: myId,
          to: opponentId,
          createdAt: serverTimestamp(),
        });
        // redirect the user to the newly created dm chat room.
        router.push(`/chats/private-chat/${chatRef.id}`);
      } else {
        // redirect the user to the dm chat room.
        router.push(`/chats/private-chat/${querySnapshot.docs[0].id}`);
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'general' } });
    }
  };

  const addUserToFriendList = async () => {
    if (auth && auth.currentUser && profile) {
      try {
        await makeFriend(auth.currentUser?.uid, profile?.uid,);
        setIsMyFriend(true);
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'data_update' } });
      }
    }
  };

  return (
    <div className='w-full grid grid-cols-2 gap-2'>
      {isMyFriend ? (
        <button type='button' onClick={() => {}}
          className='border rounded-lg py-2 block shadow-sm bg-white'
        >Poke! (Say Hi!)</button>
      ) : (
        <button type='button' onClick={addUserToFriendList}
          className='border rounded-lg py-2 block shadow-sm bg-white'
        >Send Friend Request</button>
      )}

      <button type='button' onClick={redirectToDMChat}
        className='border rounded-lg py-2 block shadow-sm bg-white'
      >Send DM</button>
    </div>
  );
};

export default OthersProfile;