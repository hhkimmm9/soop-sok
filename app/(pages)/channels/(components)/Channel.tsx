import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  doc,
  query,
  where,
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';

import { IChannel } from '@/app/interfaces';

type channelProp = {
  channelData: IChannel
};

const Channel = ({ channelData } : channelProp) => {
  const router = useRouter();

  const enterChannel = async () => {
    // update the status of the channel.
    const channelRef = doc(db, 'channels', channelData.id)
    await updateDoc(channelRef, {
      numUsers: channelData.numUsers + 1
    })

    // redriect to the selected channel page.
    router.push(`/chats/lobby/${channelData.id}`);
  };

  return (
    <div onClick={enterChannel} className='
      border border-black p-3 bg-white rounded-lg
      flex flex-col gap-2
    '>
      <h3>{ channelData.name }</h3>
      <p>현재 참여 인원: { channelData.numUsers } / { channelData.capacity }</p>
    </div>
  )
}

export default Channel