import React from 'react'

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Readonly<Props>) {
  return (
    <div className='h-full p-4 bg-stone-100'>{ children }</div>
  )
};