'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import {
  TextField,
  FormControl, InputLabel, Select, MenuItem,
  Stack, Slider,
} from '@mui/material';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import {
  collection, addDoc, getDocs,
  serverTimestamp, query, where
} from 'firebase/firestore';

import { TBanner } from '@/types';

type pageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: pageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // TODO: combine states.
  const [capacity, setCapacity] = useState(2);
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [tagOptions, setTagOptions] = useState<string[]>();
  const [tag, setTag] = useState('');

  const router = useRouter();

  const { state, dispatch } = useAppState();

  useEffect(() => {
    const fetchBanner = async () => {
      if (auth) {
        const q = query(collection(db, 'banners'),
          where('selected', '==', true)
        );

        try {
          const bannerSnapshop = await getDocs(q);
          if (!bannerSnapshop.empty) {
            const selectedBanner = bannerSnapshop.docs[0].data() as TBanner;
            setTagOptions(selectedBanner.tagOptions)
          }
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
        }
      }
    };
    fetchBanner();
  }, [dispatch]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setCapacity(newValue as number);
  };

  const redirectToFeaturesPage = () => {
    if (auth) {
      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // validate the inputs
    if (auth && auth.currentUser && name.length > 0) {
      try {
        const chatRef = await addDoc(collection(db, 'chats'), {
          capacity,
          cid: params.id,
          createdAt: serverTimestamp(),
          isPrivate,
          name,
          password,
          tag
        });
  
        router.push(`/chats/private-chat/${chatRef.id}`);
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'general' });
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
      }
    };
  };

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )
  else return (
    <form onSubmit={(e) => handleSubmit(e)} className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto rounded-lg shadow-sm bg-white
        flex flex-col gap-6
      '>
        {/* name */}
        <div className='flex flex-col gap-2'>
          <TextField id="outlined-basic" label="name" variant="outlined"
            value={name} onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* tag */}
        <div className='flex flex-col gap-2'>
          <FormControl fullWidth>
            <InputLabel id="tag-select-label">Tag</InputLabel>
            <Select
              labelId="tag-select-label" id="tag-select" label="Tag"
              value={tag} onChange={(e) => setTag(e.target.value)}
            >
              { tagOptions?.map((option) => (
                <MenuItem key={option} value={option}>{ option }</MenuItem>  
              ))}
            </Select>
          </FormControl>
        </div>
        
        {/* capacity */}
        <div className='flex flex-col gap-3'>
          <label htmlFor="capacity">Capacity</label>
          <div className='grid grid-cols-6'>
            {/* <input type="range" id='capacity' name='capacity'
              min='2' max='5' step='1'
              value={ capacity.toString() } onChange={(e) => setCapacity(parseInt(e.target.value))}
              className='col-span-3 border border-black p-1 rounded-lg
            '/> */}
            <div className='col-span-3 pl-3'>
              <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <Slider aria-label="capacity"
                  min={2} max={5} step={1}
                  value={capacity} onChange={handleChange}
                />
              </Stack>
            </div>
            <span className='col-span-1 col-start-6 text-right mr-4'>{ capacity }</span>
          </div>
        </div>
        
        {/* isPrivate */}
        <div className='flex flex-col gap-2'>
          <div className='grid grid-cols-2'>
            <div className='flex gap-2'>
              <input type="radio" id='public' name='privacy' value='public'
                checked={!isPrivate} onChange={() => setIsPrivate(false)}
                className='hidden'
              />
              <label htmlFor="public" className='inline-flex items-center cursor-pointer'>
                <span className={`w-4 h-4 border rounded-full flex-shrink-0 mr-2 ${!isPrivate ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-400'}`}></span>
                Public
              </label>
            </div>

            <div className='flex gap-2'>
              <input type="radio" id='private' name='privacy' value='private'
                checked={isPrivate} onChange={() => setIsPrivate(true)}
                className='hidden'
              />
              <label htmlFor="private" className='inline-flex items-center cursor-pointer'>
                <span className={`w-4 h-4 border rounded-full flex-shrink-0 mr-2 ${isPrivate ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-400'}`}></span>
                Private
              </label>
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
          <TextField id="outlined-basic" label="password" variant="outlined"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2.5'>
        <button type="button" onClick={redirectToFeaturesPage} className='
          w-full py-4 rounded-lg shadow-sm bg-white
          transition duration-300 ease-in-out hover:bg-stone-200
        '> Cancel </button>

        <button type='submit' className='
          w-full py-4 rounded-lg shadow-sm bg-white
          transition duration-300 ease-in-out hover:bg-stone-200
        '> Create </button>
      </div>
    </form>
  )
};

export default Page;