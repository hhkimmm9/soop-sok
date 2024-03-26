'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc, query,
  where,
  getDocs,
} from 'firebase/firestore';

import { TUser } from '@/app/types';

const OnlineUsersPage = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  const params = useParams();

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const activeUserContainer: any = [];
      const activeUserQuery = query(collection(db, 'status_board'),
        where('cId', '==', params.id)
      );
      const activeUserSnapshot = await getDocs(activeUserQuery);

      if (!activeUserSnapshot.empty) {
        activeUserSnapshot.forEach((doc) => {
          activeUserContainer.push({
            id: doc.id,
            ...doc.data()
          })
        })
        // console.log(activeUserContainer)
        setActiveUsers(activeUserContainer)
      }
    };
    fetchActiveUsers()
  }, [params.id]);
  
  return (
    <div className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto
        border border-black rounded-lg bg-white
        flex flex-col gap-4
      '>
        <ul className='flex flex-col gap-2'>
          { activeUsers.map((activeUser: any) => (
            <li key={activeUser.id} className='
              border border-black p-2 rounded-lg
              flex items-center justify-between
            '>
              <div className='flex items-center gap-3'>
                <Image src={activeUser.profilePicUrl} alt='Profile Picture'
                  width={52} height={52}
                  className='rounded-full'
                />

                <p>{ activeUser.displayName }</p>
              </div>

              {/* TODO: uId here is not their document id. */}
              <Link href={`/users/${activeUser.uId}/profile`} className='
                mr-4 border px-2 py-1 rounded-lg
              '>Profile</Link>

            </li>
          )) }
        </ul>
      </div>

      <Link href={`/chats/${params.type}/${params.id}/features`}
        className='
        w-full py-2 bg-white
        border border-black rounded-lg shadow-sm text-center
      '>Cancel</Link>
    </div>
  )
};

export default OnlineUsersPage;