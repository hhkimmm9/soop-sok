import Image from 'next/image';
import Link from 'next/link';

const User = ({
  user
}: {
  user: {
    _id: string,
    name: string
  } 
}) => {
  return (
    <Link href={`/users/${user._id}/profile`}
      className='
        border border-black bg-white p-4 rounded-lg shadow-sm
        flex gap-3
    '>
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

      <div>
        {/* last signed in, where they are */}
        <p className='font-semibold'>{ user.name }</p>
        <p>status: online</p>
      </div>
    </Link>
  )
}

export default User