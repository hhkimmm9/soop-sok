import Banner from '@/app/components/Banner';

const ChatsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full grid grid-rows-12'>
      <Banner />
      <div className='
        row-start-2 row-span-11 flex flex-col gap-4
      '>{ children }</div>
    </div>
  )
};

export default ChatsLayout;