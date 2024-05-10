'use client';

import {
  Avatar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';

import { useState, useEffect, ChangeEvent, SetStateAction } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { auth, db } from '@/utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { TUser } from '@/types';

const ProfileEdit = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<TUser>();
  const [displayName, setDisplayName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [mbti, setMbti] = useState('');

  const [signedInUser] = useAuthState(auth);
  
  const { id } = useParams();
  const router = useRouter();

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

  useEffect(() => {
    setLoading(true);

    const fecthUser = async () => {
      if (signedInUser) {
        try {
          const userRef = doc(db, 'users', signedInUser.uid);
          const querySnapshot = await getDoc(userRef);

          if (querySnapshot.exists()) {
            const data = querySnapshot.data() as TUser;
            setProfile(data);
            setDisplayName(data.displayName);
            setIntroduction(data.profile.introduction);
            setMbti(data.profile.mbti);
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    };
    fecthUser();
  }, [signedInUser])

  const updateProfilePic = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log('updateProfilePic');
  };

  const handleMBTIChange = (option: SetStateAction<string>) => {
    setMbti(option)
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signedInUser) {
      try {
        const userRef = doc(db, 'users', signedInUser.uid);
        await updateDoc(userRef, {
          displayName,
          profile: {
            introduction,
            mbti,
          }
        })
        router.push(`/profile/${id}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (profile !== undefined && !loading) return (
    <div className='pt-10 flex flex-col gap-6'>
      {/* profile picture */}
      <div className='flex justify-center'>
        <label htmlFor="profilePic">
          <Avatar src={profile.photoURL} alt="Profile Picture" sx={{ width: 192, height: 192 }} />
        </label>

        <input type="file" id="profilePic"
          onChange={(e)=> updateProfilePic(e)}
          className='hidden'
        />
      </div>

      <div className='flex flex-col gap-8'>
        {/* username */}
        <div className='flex flex-col gap-2'>
          <TextField id="outlined-basic" label="Username" variant="outlined"
            value={displayName} onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        {/* introduction */}
        <div className='flex flex-col gap-2'>
          <TextField id="outlined-basic" label="Username" variant="outlined" multiline maxRows={8}
            value={introduction} onChange={(e) => setIntroduction(e.target.value)}
          />
        </div>

        {/* mbti */}
        <div className='flex flex-col gap-2'>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">MBTI</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mbti}
              label="Age"
              onChange={(e) => handleMBTIChange(e.target.value)}
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
        
        <Link href={`/profile/${signedInUser?.uid}`}>
          <Button variant="outlined" className='w-full'>Cancel</Button>
        </Link>
        <Button onClick={handleUpdate} variant="contained">Update</Button>
      </div>
    </div>
  )
};

export default ProfileEdit;