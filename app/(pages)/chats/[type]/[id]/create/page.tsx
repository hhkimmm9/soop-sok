'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

const CreateChatPage = () => {  
  const [capacity, setCapacity] = useState(2);
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const params = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (auth.currentUser) {
      // const uid = auth.currentUser.uid;
  
      const chatRef = await addDoc(collection(db, 'chats'), {
        capacity,
        channelId: params.id,
        createdAt: serverTimestamp(),
        isPrivate,
        name,
        numUsers: 1,
        password
      })

      if (chatRef) {
        router.push(`/chats/chat/${chatRef.id}`);
      }
    };
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto
        border border-black rounded-lg bg-white
        flex flex-col gap-6
      '>
        {/* name */}
        <div className='flex flex-col gap-2'>
          <label htmlFor="name">Name</label>
          <input type="text" id='name' name='name'
            value={ name } onChange={(e) => setName(e.target.value)}
            className='
              border border-black px-2 py-1 rounded-lg
          '/>
        </div>
        
        {/* capacity */}
        <div className='flex flex-col gap-3'>
          <label htmlFor="capacity">Capacity</label>
          <div className='grid grid-cols-6'>
            <input type="range" id='capacity' name='capacity'
              min='2' max='5' step='1'
              value={ capacity.toString() } onChange={(e) => setCapacity(parseInt(e.target.value))}
              className='col-span-3 border border-black p-1 rounded-lg
            '/>
            <span className='col-span-1 col-start-6 text-right mr-4'>{ capacity }</span>
          </div>
        </div>
        
        {/* isPrivate */}
        <div className='flex flex-col gap-2'>
          <label>isPrivate</label>
          <div className='grid grid-cols-2'>
            <div className='flex gap-2'>
              <input type="radio" id='public' name='public' value='public'
                checked={!isPrivate} onChange={() => setIsPrivate(false)}
              />
              <label htmlFor="public">Public</label>
            </div>
            
            <div className='flex gap-2'>
              <input type="radio" id='private' name='private' value='private'
                checked={isPrivate} onChange={() => setIsPrivate(true)}
              />
              <label htmlFor="private">Private</label>
            </div>
          </div>
        </div>

        {/* password */}
        <div className={`${isPrivate ? 'opacity-100 pointer-events-auto ease-in duration-300' : 'opacity-0 pointer-events-none ease-in duration-300'} flex flex-col gap-2`}>
          <label htmlFor="password">Password</label>
          <input type="password" id='password' name='password'
            value={ password } onChange={(e) => setPassword(e.target.value)}
            className='border border-black p-1 rounded-lg'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2.5'>
        <Link href={`/chats/${params.type}/${params.id}/features`}
          className='
          w-full py-2 bg-white
          border border-black rounded-lg shadow-sm text-center
        '>Go Back</Link>

        <button type='submit' className='
          w-full py-2 bg-white
          border border-black rounded-lg shadow-sm
        '>Create</button>
      </div>
    </form>
  )
};

export default CreateChatPage;