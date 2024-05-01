'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/utils/AppStateProvider';

import { auth, db } from '@/utils/firebase';
import {
  collection,
  addDoc, getDocs,
  serverTimestamp, query, where
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { TBanner } from '@/types';

const CreateChat = () => {
  const [capacity, setCapacity] = useState(2);
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [tagOptions, setTagOptions] = useState<string[]>();
  const [tag, setTag] = useState('');

  const { state, dispatch } = useAppState();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const q = query(collection(db, 'banners'),
          where('selected', '==', true)
        );
  
        const bannerSnapshop = await getDocs(q);
        if (!bannerSnapshop.empty) {
          const selectedBanner = bannerSnapshop.docs[0].data() as TBanner;
          setTagOptions(selectedBanner.tagOptions)
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanner();
  }, []);

  const redirectToFeaturesPage = () => {
    dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features' });
  };

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
  
        if (chatRef) dispatch({ type: 'ENTER_CHAT', chatId: chatRef.id });

      } catch (err) {
        console.error(err);
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
              border border-black p-2 rounded-lg
          '/>
        </div>

        {/* tag */}
        <div className='flex flex-col gap-2'>
          <label htmlFor="tag">Tag</label>
          <select name="tag" id="tag"
            value={tag} onChange={(e) => setTag(e.target.value)}
            className='p-2 border border-black rounded-lg'
          >
             <option value="">Select...</option>
            { tagOptions?.map(option => (
              <option key={option} value={option}>{ option }</option>
            ))}
          </select>
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
        <div className={`flex flex-col gap-2
          ${isPrivate ?
            'opacity-100 pointer-events-auto ease-in duration-300' :
            'opacity-0 pointer-events-none ease-in duration-300'
          }
        `}>
          <label htmlFor="password">Password</label>
          <input type="password" id='password' name='password'
            value={ password } onChange={(e) => setPassword(e.target.value)}
            className='border border-black p-1 rounded-lg'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2.5'>
        <div onClick={redirectToFeaturesPage} className='
          w-full py-2 bg-white
          border border-black rounded-lg shadow-sm text-center
        '>Cancel</div>

        <button type='submit' className='
          w-full py-2 bg-white
          border border-black rounded-lg shadow-sm
        '>Create</button>
      </div>
    </form>
  )
};

export default CreateChat;