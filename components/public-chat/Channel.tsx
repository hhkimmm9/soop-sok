import { useAppState } from '@/utils/AppStateProvider';

import { auth, db } from '@/utils/firebase';
import {
  collection, doc,
  addDoc, updateDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { TChannel } from '@/types';

type ChannelProps = {
  channelData: TChannel
};

const Channel = ({ channelData } : ChannelProps) => {
  const { dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth);

  const enterChannel = async () => {
    // enable entering to the channel only if the channel is not full
    if (channelData.numUsers < channelData.capacity) {
      // update the status of the channel.
      const channelRef = doc(db, 'channels', channelData.id)
      await updateDoc(channelRef, {
        numUsers: channelData.numUsers + 1
      })
  
      const statusRef = collection(db, 'status_board');
      await addDoc(statusRef, {
        cid: channelData.id,
        displayName: signedInUser?.displayName,
        profilePicUrl: signedInUser?.photoURL,
        uid: signedInUser?.uid
      });
  
      // redriect to the selected channel page.
      dispatch({ type: 'ENTER_CHANNEL', channelId: channelData.id });
    }
  };

  return (
    <div onClick={enterChannel} className={`
        ${ channelData.numUsers < channelData.capacity ? '' : 'opacity-50'}
        p-4 rounded-lg shadow-sm bg-white
        transition duration-300 ease-in-out hover:bg-stone-200
        flex flex-col gap-2
    `}>
      <h3>{ channelData.name }</h3>
      <p>현재 참여 인원: { channelData.numUsers } / { channelData.capacity }</p>
    </div>
  )
}

export default Channel