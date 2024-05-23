import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from '@/db/firebase';
import { TMessage } from '@/types';

type ChatMessageProps = {
  message: TMessage
};

const ChatMessage = ({ message } : ChatMessageProps) => {
  const router = useRouter();

  const redirectToProfile = () => {
    if (auth) router.push(`/profile/${message?.uid}`);
  };

  return (
    <div className='grid grid-cols-6'>
      <div className='col-span-1 mt-2'>
        <div onClick={redirectToProfile}>
          <Image src={message?.senderPhotoURL} alt='Profile Picture'
            width={48} height={48}
            className='object-cover rounded-full'
          />
        </div>
      </div>
      <div className='col-span-5 ml-2 flex flex-col gap-1'>
        <span className='text-sm text-gray-600'>
          { message?.senderName }
        </span>
        <div className='
          px-3 py-2 rounded-lg
          bg-gradient-to-b from-sky-500 to-sky-400
        '>
          <span className='text-neutral-100'>
            { message.message }
          </span>
        </div>
      </div>
    </div>
  )
};

export default ChatMessage;