import Link from 'next/link';

export default function Home() {
  return (
    <div className="pt-24 flex flex-col gap-64 items-center">
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-4xl'>Lorem</h1>
        <p className=''>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus laboriosam dolor maxime suscipit tempore corrupti odit. Assumenda molestias nostrum voluptatem?</p>
      </div>
      <div>
        <Link href='/auth/signin'
          className='
            border border-black rounded-lg bg-white shadow-sm
            px-6 py-2
        '>Start</Link>
      </div>
    </div>
  );
}
