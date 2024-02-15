import Image from 'next/image';

const Message = ({
  message
} : {
  message: any
}) => {
  return (
    <div className='grid grid-cols-6'>
      <div className='col-span-1'>
        <Image
          src='https://firebasestorage.googleapis.com/v0/b/chat-platform-for-introv-9f70c.appspot.com/o/IMG_2531.jpeg?alt=media&token=a0566f94-5879-439b-9114-193f3564d378'
          alt=''
          width={1324}
          height={1827}
          className='
            object-cover
            w-12 h-12
            rounded-full
        '/>
      </div>
      <div className='
        col-span-5 ml-2 px-3 py-2 rounded-lg
        bg-gradient-to-b from-sky-500 to-sky-400
      '>
        <span className='
          text-neutral-100
        '>{ message.content }</span>
      </div>

    </div>
  )
};

export default Message;