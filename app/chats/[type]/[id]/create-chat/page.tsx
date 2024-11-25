'use client';

import { useState, useEffect, ChangeEvent, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/db/firebase';
import { getBanner, createChat } from '@/db/services';
import useDialogs from '@/functions/dispatcher';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Slider,
  SelectChangeEvent,
} from '@mui/material';

import { TBanner } from '@/types';

type pageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: pageProps) => {
  const [formState, setFormState] = useState({
    capacity: 2,
    isPrivate: false,
    name: '',
    password: '',
    tagOptions: [] as string[],
    tag: ''
  });

  const router = useRouter();

  const { messageDialog } = useDialogs();

  useEffect(() => {
    const fetchBannerOptions = async () => {
      if (auth) {
        try {
          const banner: TBanner | null = await getBanner();
          if (banner) {
            setFormState((prevState) => ({
              ...prevState,
              tagOptions: banner.tagOptions
            }));
          }
        }
        catch (err) {
          console.error(err);
          messageDialog.show('data_retrieval');
        }
      }
    };
    fetchBannerOptions();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSliderChange = (e: Event, newValue: number | number[]) => {
    setFormState((prevState) => ({
      ...prevState,
      capacity: newValue as number
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, child: ReactNode) => {
    setFormState((prevState) => ({
      ...prevState,
      tag: e.target.value as string
    }));
  };

  const handlePrivacyChange = (isPrivate: boolean) => {
    setFormState((prevState) => ({
      ...prevState,
      isPrivate
    }));
  };

  const redirectToFeaturesPage = () => {
    if (auth) router.push(`/chats/${params.type}/${params.id}/features`);
    else router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    
    // TODO: validate the inputs
    if (currentUser && formState.name.length > 0) {
      try {
        const cid = await createChat(
          params.id,
          currentUser.uid,
          formState.capacity,
          formState.name,
          formState.tag,
          formState.isPrivate,
          formState.password
        );

        if (cid) router.push(`/chats/chatroom/${cid}`);
      }
      catch (err) {
        console.error(err);
        messageDialog.show('general');
      }
    }
  };
  
  return (
    
    <form onSubmit={handleSubmit} className='h-full flex flex-col gap-4'>
      {/* input fields */}
      <div className='
        grow p-5 overflow-y-auto rounded-lg shadow-sm bg-white
        flex flex-col gap-6
      '>
        <h1 className='font-semibold capitalize text-center text-2xl text-earth-600'>create a new chat</h1>

        {/* name */}
        <div className='flex flex-col gap-2'>
          {/* TODO: no rounded? */}
          <TextField id="name" label="Name" variant="outlined"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
          />
        </div>

        {/* tag */}
        <div className='flex flex-col gap-2'>
          {/* TODO: no rounded? */}
          <FormControl fullWidth>
            <InputLabel id="tag-select-label">Tag</InputLabel>
            <Select
              labelId="tag-select-label" id="tag-select" label="Tag"
              value={formState.tag}
              onChange={handleSelectChange}
            >
              {formState.tagOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        {/* capacity */}
        <div className='flex flex-col gap-3'>
          <label htmlFor="capacity">Capacity</label>
          <div className='grid grid-cols-6'>
            <div className='col-span-3 pl-3'>
              <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                {/* TODO: color: earth */}
                <Slider
                  aria-label="capacity"
                  min={2} max={5}
                  step={1} marks={true}
                  color="primary"
                  value={formState.capacity}
                  onChange={handleSliderChange}
                />
              </Stack>
            </div>
            <span className='col-span-1 col-start-6 text-right mr-4'>{formState.capacity}</span>
          </div>
        </div>
        
        {/* isPrivate */}
        <div className='flex flex-col gap-2'>
          <div className='grid grid-cols-2'>
            <div className='flex gap-2'>
              <input type="radio" id='public' name='privacy' value='public'
                checked={!formState.isPrivate}
                onChange={() => handlePrivacyChange(false)}
                className='hidden'
              />
              <label htmlFor="public" className='inline-flex items-center cursor-pointer'>
                <span className={`w-4 h-4 border rounded-full flex-shrink-0 mr-2 ${!formState.isPrivate ? 'bg-earth-500 border-earth-500' : 'bg-white border-gray-400'}`}></span>
                Public
              </label>
            </div>

            <div className='flex gap-2'>
              <input type="radio" id='private' name='privacy' value='private'
                checked={formState.isPrivate}
                onChange={() => handlePrivacyChange(true)}
                className='hidden'
              />
              <label htmlFor="private" className='inline-flex items-center cursor-pointer'>
                <span className={`w-4 h-4 border rounded-full flex-shrink-0 mr-2 ${formState.isPrivate ? 'bg-earth-500 border-earth-500' : 'bg-white border-gray-400'}`}></span>
                Private
              </label>
            </div>
          </div>
        </div>

        {/* password */}
        <div className={`flex flex-col gap-2
          ${formState.isPrivate ?
            'opacity-100 pointer-events-auto ease-in duration-300' :
            'opacity-0 pointer-events-none ease-in duration-300'
          }
        `}>
          <TextField id="password" label="Password" variant="outlined"
            name="password"
            value={formState.password}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* buttons */}
      <div className='grid grid-cols-2 gap-2.5'>
        <button type="button" onClick={redirectToFeaturesPage} className='
          w-full py-4 rounded-lg shadow bg-white
          font-semibold text-xl text-earth-400
          transition duration-300 ease-in-out hover:bg-earth-50
        '> Cancel </button>

        <button type='submit' className='
          w-full py-4 rounded-lg shadow bg-earth-100
          font-semibold text-xl text-earth-600
          transition duration-300 ease-in-out hover:bg-earth-200
        '> Create </button>
      </div>
    </form>
  );
};

export default Page;