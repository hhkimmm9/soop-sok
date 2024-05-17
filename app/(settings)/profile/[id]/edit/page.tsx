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
  TextField,
} from '@mui/material';

import {
  useState, useEffect,
  ChangeEvent, SetStateAction,
} from 'react';
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
  const [introduction, setIntroduction] = useState('');
  const [mbti, setMbti] = useState('');
  
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
            setIntroduction(data.profile?.introduction); // Use optional chaining
            setMbti(data.profile?.mbti); // Use optional chaining
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
  }, [dispatch]); // Add auth as a dependency if needed

  useEffect(() => {
    const handleUpdate = async () => {
      if (auth && auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
  
        try {
          await updateDoc(userRef, {
            displayName: profile?.displayName,
            profile: {
              introduction: profile?.profile.introduction,
              mbti: profile?.profile.mbti,
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
  }, [
    state.actionsDialogResponse,
    dispatch,
    id, profile?.displayName, profile?.profile.introduction, profile?.profile.mbti,
    router
  ]);

  const updateProfilePic = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log('updateProfilePic');
  };

  const updateDisplayName = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => {
      return {
        ...prev,
        displayName: e.target.value,
      } as TUser;
    });
  };

  const handleMBTIChange = (option: SetStateAction<string>) => {
    setMbti(option)
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
          <Image src={profile.photoURL} alt='Profile Picture'
            width={192} height={192} className='object-cover rounded-full'
          />
        </label>

        <input type='file' id='profilePic'
          onChange={(e)=> updateProfilePic(e)}
          className='hidden'
        />
      </div>

      <div className='flex flex-col gap-8'>
        {/* username */}
        <div className='flex flex-col gap-2'>
          <TextField id='outlined-basic' label='Username' variant='outlined'
            value={profile.displayName} onChange={updateDisplayName}
          />
        </div>

        {/* introduction */}
        <div className='flex flex-col gap-2'>
          <TextField id='outlined-basic' label='Username' variant='outlined' multiline maxRows={8}
            value={introduction} onChange={(e) => setIntroduction(e.target.value)}
          />
        </div>

        {/* mbti */}
        <div className='flex flex-col gap-2'>
          <FormControl fullWidth>
            <InputLabel id='mbti-select-label'>MBTI</InputLabel>
            <Select
              labelId='mbti-select-label' id='mbti-select' label='MBTI'
              value={mbti} onChange={(e) => handleMBTIChange(e.target.value)}
            >
              { MBTIOptions.map((option) => (
                <MenuItem key={option[0]} value={option[0]}>{ option[1] }</MenuItem>  
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
  </>)
};

export default ProfileEdit;