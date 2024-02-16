import Banner from '@/app/components/Banner';
import ChatWindow from '@/app/components/chat-window/ChatWindow';

const page = () => {
  return (
    <div className='
      w-screen h-screen px-4 py-8
      flex flex-col gap-4
    '>
      <Banner />

      <ChatWindow />
    </div>
  )
};

export default page;