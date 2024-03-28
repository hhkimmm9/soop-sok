'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/app/utils/AppStateProvider';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc,
  query, or, where,
  getDoc, getDocs
} from 'firebase/firestore';

import SearchBar from '@/app/components/SearchBar';
import PrivateChatWindow from '@/app/components/PrivateChatWindow';
import PrivateChat from '@/app/components/PrivateChat';

import { TUser, TPrivateChat } from '@/app/types';

const PrivateChats = () => {
  const [user, setUser] = useState<TUser>();
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>();

  const { state, dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);

  useEffect(() => {
    const fetchMessages = async () => {
      const messageContainer: TPrivateChat[] = []
      if (signedInUser) {
        // fetch DM messages associated with the currently signed-in user.
        const chatQuery = query(collection(db, 'private_chats'),
          or(
            where('from', '==', signedInUser.uid),
            where('to', '==', signedInUser.uid),
          )
        );
        const chatSnapshot = await getDocs(chatQuery);
        if (!chatSnapshot.empty) {
          chatSnapshot.forEach((doc) => {
            messageContainer.push({
              id: doc.id,
              ...doc.data()
            } as TPrivateChat)
          });
          setPrivateChats(messageContainer);
        }
      }
    };
    fetchMessages();
  }, [signedInUser]);

  return (
    <>
      { state.activatePrivateChat ? (
        <PrivateChatWindow />
      ) : (
        <div className='flex flex-col gap-6'>
          {/* interaction area */}
          <SearchBar
            goBack={() => {}}
            onSubmit={(searchQuery: string) => console.log(searchQuery) }
          />

          {/* private chats */}
          <div className='flex flex-col gap-2'>
            { privateChats?.map((privateChat: TPrivateChat) => (
              <PrivateChat key={privateChat.id} privateChat={privateChat} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PrivateChats;