import React from 'react';
import Friend from '@/app/pages/friends/(components)/Friend';

const Friends = () => {
  const friends = [
    {
      _id: '1',
      name: 'User 1',
    },
    {
      _id: '2',
      name: 'User 2',
    },
    {
      _id: '3',
      name: 'User 3',
    },
  ];

  return (
    <div className='flex flex-col gap-2'>
      { friends.map((friend: any) => (
        <Friend key={friend.id} friend={friend} />
      )) }
    </div>
  )
}

export default Friends