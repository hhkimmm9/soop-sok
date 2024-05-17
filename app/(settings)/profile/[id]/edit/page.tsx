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
import { auth, db } from '@/utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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

  // TODO: combine states.
  const [profile, setProfile] = useState<TUser | null>(null);
  
  const { id } = useParams();
  const router = useRouter();

  const { state, dispatch } = useAppState();

  useEffect(() => {
    const fetchUser = async () => {
      if (auth && auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);

        try {
          const querySnapshot = await getDoc(userRef);
          if (querySnapshot.exists()) {
            const data = querySnapshot.data() as TUser;
            // TODO: combine states.
            setProfile(data);
          }
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
        }
      };
    };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const handleUpdate = async () => {
      if (auth && auth.currentUser && profile) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
  
        try {
          await updateDoc(userRef, {
            displayName: profile.displayName,
            profile: {
              introduction: profile.profile?.introduction,
              mbti: profile.profile?.mbti,
            }
          })
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
  }, [state.actionsDialogResponse, dispatch, id, profile, router]);

  const updateProfileField = (field: string, value: any) => {
    setProfile((prev) => {
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

  const handlePhotoURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProfileField('photoURL', e.target.value);
  };

  const handleDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProfileField('displayName', e.target.value);
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

  else if (!isLoading && profile) return (<>
    <div className='pt-10 flex flex-col gap-6'>
      {/* profile picture */}
      <div className='flex justify-center'>
        <label htmlFor='profilePic'>
          {/* <Avatar src={profile.photoURL} alt='Profile Picture' sx={{ width: 192, height: 192 }} /> */}
          <Image
            src={profile.photoURL}
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
            value={profile.displayName}
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
            value={profile.profile?.introduction || ''}
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
              value={profile.profile?.mbti || ''}
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