'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/app/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfileEdit = () => {
  const [loading, setLoading] = useState(false);
  const [introduction, setIntroduction] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const params = useParams();
  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  useEffect(() => {
    const fecthUser = async () => {
      if (signedInUser) {
        try {
          const userRef = doc(db, 'users', signedInUser.uid);
          const querySnapshot = await getDoc(userRef);

          if (querySnapshot.exists()) {
            const data = querySnapshot.data();
            setIntroduction(data.profile.introduction);
            setInterests(data.profile.profile);
          }
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(true);
    };

    fecthUser();
  }, [signedInUser])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signedInUser) {
      try {
        const userRef = doc(db, 'users', signedInUser.uid);
        await updateDoc(userRef, {
          profile: {
            introduction,
          }
        })
        router.push(`/profile/${params.id}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleUpdate(e)} className='flex flex-col gap-2'>
        <div className='flex flex-col gap-2'>
          <label htmlFor="introduction">Introduction</label>
          <input id='introduction' type="text"
            value={introduction} onChange={(e) => setIntroduction(e.target.value)}
          />
        </div>
        {/* <div className='flex flex-col gap-2'>
          <label htmlFor="interests">Interests</label>
        </div> */}
        <div className='flex justify-end'>
          <button type='submit' className='bg-white p-2'>Update</button>
        </div>
      </form>
    </div>
  )
};

export default ProfileEdit;