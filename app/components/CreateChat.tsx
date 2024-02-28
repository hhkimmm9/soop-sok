import { FormEvent, useState } from 'react';

const CreateChat = ({
  showCreateChat, setShowCreateChat,
} : {
  showCreateChat: boolean, setShowCreateChat: any,
}) => {
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState(2);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log('handlesSubmit: ')

    setShowCreateChat(false);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col gap-6'>
      {/* title */}
      <div className='flex flex-col gap-2'>
        <label htmlFor="title">Title</label>
        <input type="text" id='title' name='title'
          value={ title } onChange={(e) => setTitle(e.target.value)}
          className='
            border border-black px-2 py-1 rounded-lg
        '/>
      </div>
      
      {/* capacity */}
      <div className='flex flex-col gap-3'>
        <label htmlFor="capacity">최대 참여 인원</label>
        <div className='grid grid-cols-6'>
          <input type="range" id='capacity' name='capacity'
            min='2' max='5' step='1'
            value={ capacity.toString() } onChange={(e) => setCapacity(parseInt(e.target.value))}
            className='col-span-3 border border-black p-1 rounded-lg
          '/>
          <span className='col-span-1 col-start-6 text-right mr-4'>{ capacity }</span>
        </div>
      </div>
      
      {/* isPrivate */}
      <div className='flex flex-col gap-2'>
        <div>공개방</div>

        <div className='grid grid-cols-2'>
          <div className='flex gap-2'>
            <input type="radio" id='public' name='public' value='public'
              checked={!isPrivate} onChange={() => setIsPrivate(false)}
            />
            <label htmlFor="public">Public</label>
          </div>
          
          <div className='flex gap-2'>
            <input type="radio" id='private' name='private' value='private'
              checked={isPrivate} onChange={() => setIsPrivate(true)}
            />
            <label htmlFor="private">Private</label>
          </div>
        </div>
      </div>

      {/* password */}
      <div className={`${isPrivate ? 'opacity-100 pointer-events-auto ease-in duration-300' : 'opacity-0 pointer-events-none ease-in duration-300'} flex flex-col gap-2`}>
        <label htmlFor="password">Password</label>
        <input type="password" id='password' name='password'
          value={ password } onChange={(e) => setPassword(e.target.value)}
          className='border border-black p-1 rounded-lg'
        />
      </div>
    </form>
  )
};

export default CreateChat;