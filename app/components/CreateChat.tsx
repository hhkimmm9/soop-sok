import { useState } from 'react';

const CreateChat = ({
  showCreatePage, setShowCreatePage,
} : {
  showCreatePage: boolean, setShowCreatePage: any,
}) => {
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [isPrivate, setIsPrivate] = useState(true);
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    console.log('handlesSubmit')

    setShowCreatePage(false);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col gap-6'>
      {/* title */}
      <div className='flex flex-col gap-2'>
        <label htmlFor="title">Title</label>
        <input type="text" id='title' name='title'
          value={ title } onChange={(e) => setTitle(e.target.value)}
          className='
            border border-black p-1 rounded-lg
        '/>
      </div>
      
      {/* capacity */}
      <div className='flex flex-col gap-3'>
        <label htmlFor="capacity">최대 참여 인원</label>
        <input type="text" id='capacity' name='capacity'
          value={ capacity.toString() } onChange={(e) => setCapacity(parseInt(e.target.value))}
          className='
            border border-black p-1 rounded-lg
        '/>
      </div>
      
      {/* isPrivate */}
      <div className='flex flex-col gap-2'>
        <div>공개방</div>

        <div className='grid grid-cols-2'>
          <div className='flex gap-2'>
            <input type="radio" id='private' name='private' value='private' />
            <label htmlFor="private">Private</label>
          </div>

          <div className='flex gap-2'>
            <input type="radio" id='public' name='public' value='public' />
            <label htmlFor="public">Public</label>
          </div>
        </div>
      </div>

      {/* password */}
      { isPrivate && (
        <div className='flex flex-col gap-2'>
          <label htmlFor="password">Password</label>
          <input type="password" id='password' name='password'
            value={ password } onChange={(e) => setPassword(e.target.value)}
            className='border border-black p-1 rounded-lg'
          />
        </div>
      )}
      
    </form>
  )
};

export default CreateChat;