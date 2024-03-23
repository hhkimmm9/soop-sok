'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/app/components/SearchBar';
import DirectMessage from './components/DirectMessage';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc,
  query, or, where,
  getDoc, getDocs
} from 'firebase/firestore';

import { TUser, TMessage, TPrivateChat } from '@/app/types';

const DirectMessages = () => {
  const [user, setUser] = useState<TUser>();
  const [privateChats, setPrivateChats] = useState<TPrivateChat[]>();

  const [signedInUser] = useAuthState(auth);
  
  useEffect(() => {
    const fetchMessages = async () => {
      // check authentication
      if (signedInUser) {
        // fetch user data
        const userQuery = query(collection(db, 'users'),
          where('uId', '==', signedInUser.uid)
        );
        const userSnapshot = await getDocs(userQuery);
        
        // if found, store it into the user state.
        if (!userSnapshot.empty) {
          const userData = {
            id: userSnapshot.docs[0].id,
            ...userSnapshot.docs[0].data()
          } as TUser
          setUser(userData);
        }
      };
    };
    fetchMessages();
  }, [signedInUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messageContainer: TPrivateChat[] = []
      if (user) {
        // fetch DM messages associated with the currently signed in user.
        const chatQuery = query(collection(db, 'private_chats'),
          or(
            where('from', '==', user.id),
            where('to', '==', user.id),
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
  }, [user]);

  return (
    <div className='flex flex-col gap-6'>
      {/* interaction area */}
      <SearchBar
        goBack={() => { console.log('go back') }}
        onSubmit={(searchQuery: string) => console.log(searchQuery) }
      />

      {/* private chats */}
      <div className='flex flex-col gap-2'>
        { privateChats?.map((privateChat: TPrivateChat) => (
          <DirectMessage key={privateChat.id} privateChat={privateChat} />
        ))}
      </div>
        
    </div>
  );
};

export default DirectMessages;