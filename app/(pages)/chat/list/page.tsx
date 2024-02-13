import React from 'react'

import Banner from '@/app/components/Banner'
import InteractionArea from '@/app/components/InteractionArea'

const page = () => {
  return (
    <div className='
      w-screen min-h-screen my-12 px-4
      flex flex-col gap-3
    '>
      <Banner />

      <InteractionArea />

      chat list
    </div>
  )
}

export default page