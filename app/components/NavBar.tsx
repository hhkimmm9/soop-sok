import Link from 'next/link';

import {
  QueueListIcon,
  ChatBubbleBottomCenterIcon,
  UserIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const NavBar = () => {
  return (
    <div className="
      fixed bottom-0 w-full h-14
      border-t border-black
      px-12 flex justify-between items-center
    ">
      <Link href='/channels'
        className="rounded-full px-3
      ">
        <QueueListIcon className='h-5 w-5' />
      </Link>

      <Link href='/chats'
        className="rounded-full px-3
      ">
        <ChatBubbleBottomCenterIcon className='h-5 w-5' />
      </Link>

      <Link href='/users'
        className="rounded-full px-3
      ">
        <UserIcon className='h-5 w-5' />
      </Link>

      <Link href='/settings'
        className="rounded-full px-3
      ">
        <Cog6ToothIcon className='h-5 w-5' />
      </Link>
    </div> 
  )
}

export default NavBar