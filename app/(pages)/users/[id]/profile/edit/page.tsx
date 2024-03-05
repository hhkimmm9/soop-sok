'use client';

import { useState, useEffect, FormEvent } from 'react';
import { auth } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const ProfileEdit = () => {
  const [signedInUser, loading, error] = useAuthState(auth);
  
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState('');

  useEffect(() => {
    // fetch user data 
  }, [])

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    // const res = await fetch('/api', {

    // });
  };

  return (
    <div>
      <form onSubmit={(e) => handleUpdate(e)}>
        <div className='flex flex-col gap-2'>
          <label htmlFor="profile">Profile</label>
          <input id='profile' type="text"
            value={profile} onChange={(e) => setProfile(e.target.value)}
          />
        </div>
      </form>
    </div>
  )
};

export default ProfileEdit;