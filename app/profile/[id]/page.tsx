'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { auth, db } from '@/utils/firebase';
import {
  collection, doc, query,
  or, where, limit,
  addDoc, getDoc, getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { TUser } from '@/types';

const Profile = () => {
  const [profile, setProfile] = useState<TUser>();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMyFriend, setIsMyFriend] = useState(false);

  const { dispatch } = useAppState();

  const { id } = useParams();
  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  useEffect(() => {
    const fetchData = async () => {
      if (signedInUser) {
        try {
          // fetch profile data with the given id in the URL.
          const profileRef = doc(db, 'users', id.toString());
          const profileSnapshot = await getDoc(profileRef);
  
          if (profileSnapshot.exists()) {
            const profileData = { ...profileSnapshot.data() } as TUser;
            setProfile(profileData);
            setIsMyProfile(signedInUser.uid === id);
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(true);
    };
    const checkIsMyFriend = async () => {
      if (signedInUser) {
        const q = query(collection(db, 'friend_list'), 
          or(
            where("senderId", "==", id),
            where("receiverId", "==", id),
          )
        )
        try {
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setIsMyFriend(true);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchData();
    checkIsMyFriend();
  }, [signedInUser, id])

  const addUserToFriendList = async () => {
    await addDoc(collection(db, 'friend_list'), {
      creaetdAt: serverTimestamp(),
      receiverId: id,
      senderId: signedInUser?.uid,
    });

    setIsMyFriend(true);
  };

  const redirectToDMChat = async () => {
    const myId = signedInUser?.uid;
    const opponentId = id;

    // check if their dm chat exists
    const q = query(collection(db, 'private_chats'),
      or(
        (where('from', '==', myId), where('to', '==', opponentId)),
        (where('to', '==', myId), where('from', '==', opponentId))
      ),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    // if it doesn't, create a dm chat room first
    if (querySnapshot.empty) {
      const docRef = await addDoc(collection(db, 'private_chats'), {
        from: myId,
        to: opponentId,
        createdAt: serverTimestamp(),
      });
      // redirect the user to the newly created dm chat room.
      dispatch({ type: 'SET_TO_PRIVATE_CHAT' })
      dispatch({ type: 'ENTER_PRIVATE_CHAT', privateChatId: docRef.id });
    } else {
      // redirect the user to the dm chat room.
      dispatch({ type: 'SET_TO_PRIVATE_CHAT' });
      dispatch({ type: 'ENTER_PRIVATE_CHAT', privateChatId: querySnapshot.docs[0].id });
    }

    router.push('/components');
  };

  const renderButtonComponents = () => {
    // my profile
    if (isMyProfile) return (
      <div className='w-full flex flex-col gap-8'>
        <Link href={`/profile/${profile?.uid}/edit`}
          className='border rounded-lg py-2 block shadow-sm text-center'
        > Edit Profile </Link>
      </div>
    )
    
    // other account's profile
    else return  (
      <div className='w-full grid grid-cols-2 gap-2'>
        { isMyFriend ? (
            <button type='button' onClick={() => {}}
              className='border rounded-lg py-2 block shadow-sm
            '> Poke! (Say Hi!) </button>
          ) : (
            <button type='button' onClick={addUserToFriendList}
              className='border rounded-lg py-2 block shadow-sm
            '> Send Friend Request </button>
          )
        }
        <button type='button' onClick={redirectToDMChat}
          className='border rounded-lg py-2 block shadow-sm
        '> Send DM </button>
      </div>
    )
  };

  if (profile !== undefined && loading) return (
    <div className='pt-10 flex flex-col gap-4'>
      {/* pic and name */}
      <div className='w-full grid grid-cols-4'>
        <div className='pl-2'>
          <Image src={profile.photoURL} alt=''
            width={128} height={128} className={`
              cols-span-1 object-cover rounded-full
          `}/>
        </div>

        <div className='cols-span-3 pl-6 flex flex-col gap-2'>
          <p className='mx-auto text-center text-2xl font-medium whitespace-nowrap'>
            { profile.displayName }
          </p>

          <p className='
            px-3 py-1 rounded-full bg-purple-300
            font-medium text-base text-center text-white
          '>
            { profile.profile.mbti }
          </p>
        </div>
      </div>

      {/* buttons */}
      <div>
        { renderButtonComponents() }
      </div>
      
      {/*  */}
      <div className='flex flex-col gap-4'>
        <div className='h-68 p-2 border rounded-lg overflow-y-auto'>
          <p>{ profile.profile.introduction }</p>
        </div>
      </div>

    </div>
  )
};

export default Profile;