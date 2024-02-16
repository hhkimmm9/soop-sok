import React from 'react';
import Image from 'next/image';

import Buttons from './components/Buttons'

const Profile = () => {

  return (
    <div className='
      pt-24 flex flex-col gap-16 items-center
    '>
      <div className=''>
        <Image
          src='https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/IMG_2531.jpeg?alt=media&token=a0566f94-5879-439b-9114-193f3564d378'
          alt=''
          width={1324}
          height={1827}
          className='
            object-cover
            w-72 h-72
            rounded-full
        '/>
      </div>
      <div className='
        text-5xl
        font-medium
      '>
        은솔공주
      </div>
      
      <Buttons yourself={true} />
    </div>
  )
};

export default Profile;