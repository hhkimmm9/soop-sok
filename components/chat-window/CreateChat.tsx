'use client';

import { useState } from 'react';
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

const CreateChat = () => {
  const [name, setName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tag, setTag] = useState('');
  const [capacity, setCapacity] = useState(3);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  const { state, dispatch } = useAppState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // validate the inputs
    if (auth.currentUser && name.length > 0) {
      try {
        const chatRef = await addDoc(collection(db, 'chats'), {
          capacity,
          channelId: state.channelId,
          createdAt: serverTimestamp(),
          isPrivate,
          name,
          numUsers: 1,
          password,
          tag
        });
  
        if (chatRef) {
          dispatch({ type: 'ENTER_CHAT', chatId: chatRef.id });
        }
      } catch (err) {
        console.error(err);
      }
    };
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='h-full flex flex-col gap-4'>
      {/* options */}
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

        {/* tag */}
        <div className='flex flex-col gap-3'>
          <label htmlFor='tag'>Tag</label>
          { !tag ? (
            <div className='flex gap-3'>
              {/* TODO: once tag options section is created when the broadcast system is completed, change the type of input to select. and somehow fetch those tag options.  */}
              <input type="text" id='tag' name='tag'
                value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                className='
                  grow border border-black px-2 py-1 rounded-lg
              '/>
              <button type='button' onClick={() => { setTag(tagInput) }}
                className='border px-2 py-1 rounded-lg'
              >Add</button>
            </div>
          ) : (
            <div className='flex gap-3'>
              <p className='grow px-2 py-1 rounded-lg'>{ tag }</p>
              <button type='button' onClick={() => { setTag(''); setTagInput(''); }}
                className='border px-2 py-1 rounded-lg'
              >Delete</button>
            </div>
          ) }
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
        { isPrivate && (
          <div className='flex flex-col gap-2'>
            <label htmlFor="password">Password</label>
            <input type="password" id='password' name='password'
              value={ password } onChange={(e) => setPassword(e.target.value)}
              className='border border-black p-1 rounded-lg'
            />
          </div>
        )}
      </div>

      {/* buttons */}
      <div className='grid grid-cols-2 gap-2.5'>
        <div onClick={() => dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features' })}
          className='
          w-full py-2 bg-white
          border border-black rounded-lg shadow-sm text-center
        '>Cancel</div>

        <button type='submit'
          className='
            w-full py-2 bg-white
            border border-black rounded-lg shadow-sm
        '>Create</button>
      </div>
    </form>
  )
};

export default CreateChat;