import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/utils/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection, doc,
  addDoc, updateDoc,
} from 'firebase/firestore';

import { TChannel } from '@/app/types';

type ChannelProps = {
  channelData: TChannel
};

const Channel = ({ channelData } : ChannelProps) => {
  const router = useRouter();

  const [signedInUser] = useAuthState(auth);

  const enterChannel = async () => {
    // update the status of the channel.
    const channelRef = doc(db, 'channels', channelData.id)
    await updateDoc(channelRef, {
      numUsers: channelData.numUsers + 1
    })

    // console.log(signedInUser)

    const statusRef = collection(db, 'status_board');
    await addDoc(statusRef, {
      cid: channelData.id,
      displayName: signedInUser?.displayName,
      profilePicUrl: signedInUser?.photoURL,
      uid: signedInUser?.uid
    });

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