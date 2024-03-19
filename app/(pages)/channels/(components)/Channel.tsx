import Link from 'next/link';

import { IChannel } from '@/app/interfaces';

const Channel = ({
  channelData
} : {
  channelData: IChannel
}) => {
  return (
    <Link href={`/chats/lobby/${channelData.id}`} className='
      border border-black p-3 bg-white rounded-lg
      flex flex-col gap-2
    '>
      <h3>{ channelData.name }</h3>
      <p>현재 참여 인원: { channelData.numUsers } / { channelData.capacity }</p>
    </Link>
  )
}

export default Channel