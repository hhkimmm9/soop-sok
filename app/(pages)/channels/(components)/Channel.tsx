import Link from 'next/link';

const Channel = ({
  channelInfo
} : {
  channelInfo: any
}) => {
  return (
    <Link href={`/channels/${channelInfo.id}`}className='
      border border-black p-3 bg-white rounded-lg
      flex flex-col gap-2
    '>
      <h3>{ channelInfo.title }</h3>
      <p>현재 참여 인원: { channelInfo.numAttendants } / { channelInfo.capacity }</p>
    </Link>
  )
}

export default Channel