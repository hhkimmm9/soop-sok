'use client';

import ProgressIndicator from '@/components/ProgressIndicator';
import Image from 'next/image';
import Link from 'next/link';
import {
  Avatar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';

import { useState, useEffect, ChangeEvent, ReactNode, } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/db/firebase';
import { fetchUser, updateUserProfile } from '@/db/utils';

import { TUser } from '@/types';

const MBTIOptions = [
  ['istj', 'ISTJ'],
  ['isfj', 'ISFJ'],
  ['infj', 'INFJ'],
  ['intj', 'INTJ'],
  ['istp', 'ISTP'],
  ['isfp', 'ISFP'],
  ['infp', 'INFP'],
  ['intp', 'INTP'],
  ['estp', 'ESTP'],
  ['esfp', 'ESFP'],
  ['enfp', 'ENFP'],
  ['entp', 'ENTP'],
  ['estj', 'ESTJ'],
  ['esfj', 'ESFJ'],
  ['enfj', 'ENFJ'],
  ['entj', 'ENTJ']
];

const ProfileEdit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TUser | null>(null);
  
  const { id } = useParams();
  const router = useRouter();

  const { state, dispatch } = useAppState();

  useEffect(() => {
    (async () => {
      if (auth && auth.currentUser) {
        try {
          const user = await fetchUser(auth.currentUser.uid);

          // Error handling: 404 not found
          if (!user) {
            // 
          }

          setUser(user);

          setIsLoading(false);
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
        }
      };
    })();
  }, [dispatch]);

  // It needs to be in useEffect to work with a confirm dialog.
  useEffect(() => {
    const handleUpdate = async () => {
      if (auth && auth.currentUser && user) {
        try {
          await updateUserProfile(auth.currentUser.uid, user);

          router.push(`/profile/${id}`);
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_update' });
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
        }
      }
    };

    // confirm
    if (state.actionsDialogResponse) {
      handleUpdate();
      dispatch({ type: 'SET_ACTIONS_DIALOG_RESPONSE', payload: false });
    }
    // cancel
    else {
      dispatch({ type: 'SHOW_ACTIONS_DIALOG', payload: false });
    }
  }, [state.actionsDialogResponse, dispatch, id, user, router]);

  const updateField = (field: string, value: any) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      } as TUser;
    });
  };

  const handlePhotoURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateField('photoURL', e.target.value);
  };
  
  const handleDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateField('displayName', e.target.value);
  };
  
  const updateProfileField = (field: string, value: any) => {
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value,
        },
      } as TUser;
    });
  };
  
  const handleMBTIChange = (e: SelectChangeEvent<string>, child: ReactNode) => {
    updateProfileField('mbti', e.target.value as string);
  };
  
  const handleIntroductionChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProfileField('introduction', e.target.value);
  };

  const getConfirm = () => {
    dispatch({ type: 'SET_ACTIONS_DIALOG_TYPE', payload: 'confirm' });
    dispatch({ type: 'SHOW_ACTIONS_DIALOG', payload: true });
  };

  if (isLoading) return (
    <div className='h-full flex justify-center items-center'>
      <ProgressIndicator />
    </div>
  )

  else if (!isLoading && user && user.profile) return (<>
    <div className='pt-10 flex flex-col gap-6'>
      {/* profile picture */}
      <div className='flex justify-center'>
        <label htmlFor='profilePic'>
          {/* <Avatar src={profile.photoURL} alt='Profile Picture' sx={{ width: 192, height: 192 }} /> */}
          <Image
            src={user.photoURL}
            alt='Profile Picture'
            width={192}
            height={192}
            className='object-cover rounded-full'
          />
        </label>
        <input
          type='file'
          id='profilePic'
          onChange={handlePhotoURLChange}
          className='hidden'
        />
      </div>
      <div className='flex flex-col gap-8'>
        {/* username */}
        <div className='flex flex-col gap-2'>
          <TextField
            id='outlined-basic'
            label='Username'
            variant='outlined'
            value={user.displayName}
            onChange={handleDisplayNameChange}
          />
        </div>
        {/* introduction */}
        <div className='flex flex-col gap-2'>
          <TextField
            id='outlined-basic'
            label='Username'
            variant='outlined'
            multiline maxRows={8}
            value={user.profile.introduction || ''}
            onChange={handleIntroductionChange}
          />
        </div>
        {/* mbti */}
        <div className='flex flex-col gap-2'>
          <FormControl fullWidth>
            <InputLabel id='mbti-select-label'>MBTI</InputLabel>
            <Select
              labelId='mbti-select-label'
              id='mbti-select'
              label='MBTI'
              value={user.profile.mbti || ''}
              onChange={handleMBTIChange}
            >
              { MBTIOptions.map((option) => (
                <MenuItem key={option[0]} value={option[0]}>
                  { option[1] }
                </MenuItem>  
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* update button */}
      <div className='mt-4 grid grid-cols-2 gap-3'>
        <Link href={`/profile/${auth.currentUser?.uid}`}>
          <Button variant='outlined' className='w-full'> Cancel </Button>
        </Link>
        <Button onClick={getConfirm} variant='contained'> Update </Button>
      </div>
    </div>
  </>);
};

export default ProfileEdit;