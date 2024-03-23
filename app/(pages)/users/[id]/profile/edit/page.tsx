'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc,
  query, where, limit,
  addDoc, getDoc, getDocs, updateDoc,
  serverTimestamp
} from 'firebase/firestore';

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
        const q = query(collection(db, 'users'),
          where('uId', '==', signedInUser.uid),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs[0].data()

        if (data) {
          setIntroduction(data.profile.introduction);
          setInterests(data.profile.profile);
        }
      }
      setLoading(true);
    };

    fecthUser();
  }, [signedInUser])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signedInUser) {
      const q = query(collection(db, 'users'),
        where('uId', '==', params.id.toString())
      );
      const querySnapshot = await getDocs(q);
      const userRef = querySnapshot.docs[0].ref;
      await updateDoc(userRef, {
        profile: {
          introduction,
        }
      })

      router.push(`/users/${params.id}/profile`);
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