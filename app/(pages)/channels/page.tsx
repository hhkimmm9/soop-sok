import React from 'react';
import Channel from './(components)/Channel';

const SelectChannel = () => {
  var channelInfo = [
    {
      _id: '1',
      title: '개인 고민',
      numAttendants: 13,
      capacity: 32
    },
    {
      _id: '2',
      title: '연애 고민',
      numAttendants: 31,
      capacity: 32
    },
    {
      _id: '3',
      title: '장래 고민',
      numAttendants: 13,
      capacity: 32
    },
    {
      _id: '4',
      title: '사연',
      numAttendants: 13,
      capacity: 32
    },
    {
      _id: '5',
      title: '토론 1',
      numAttendants: 13,
      capacity: 32
    },
    {
      _id: '6',
      title: '토론 2',
      numAttendants: 13,
      capacity: 32
    },
    {
      _id: '7',
      title: '아무거나',
      numAttendants: 13,
      capacity: 32
    },
    {
      _id: '8',
      title: '성인들만',
      numAttendants: 13,
      capacity: 32
    },
  ];

  return (
    <div className='flex flex-col gap-2'>
      <Channel channelInfo={channelInfo[0]} />
      <Channel channelInfo={channelInfo[1]} />
      <Channel channelInfo={channelInfo[2]} />
      <Channel channelInfo={channelInfo[3]} />
      <Channel channelInfo={channelInfo[4]} />
      <Channel channelInfo={channelInfo[5]} />
      <Channel channelInfo={channelInfo[6]} />
      <Channel channelInfo={channelInfo[7]} />
    </div>
  )
};

export default SelectChannel;