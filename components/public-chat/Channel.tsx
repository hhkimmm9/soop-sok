import { useAppState } from '@/utils/AppStateProvider';

import { auth, db } from '@/utils/firebase';
import {
  collection, doc,
  addDoc, updateDoc,
} from 'firebase/firestore';

import { TChannel } from '@/types';

type ChannelProps = {
  channel: TChannel
};

const Channel = ({ channel } : ChannelProps) => {
  const { dispatch } = useAppState();

  const enterChannel = async () => {
    // Allow entry into the channel only if it is not full.
    if (auth && auth.currentUser && channel.numUsers < channel.capacity) {
      // Update the capacity of the channel.
      await updateDoc(doc(db, 'channels', channel.id), {
        numUsers: channel.numUsers + 1
      })
  
      // Log where the user is in.
      await addDoc(collection(db, 'status_board'), {
        cid: channel.id,
        displayName: auth.currentUser.displayName,
        profilePicUrl: auth.currentUser.photoURL,
        uid: auth.currentUser.uid
      });
  
      // Redriect to the selected channel page.
      dispatch({ type: 'ENTER_CHANNEL', channelId: channel.id });
    }
  };

  return (
    <div onClick={enterChannel} className={`
        ${ channel.numUsers < channel.capacity ? '' : 'opacity-50'}
        p-4 rounded-lg shadow-sm bg-white
        transition duration-300 ease-in-out hover:bg-stone-200
        flex flex-col gap-2
    `}>
      <h3>{ channel.name }</h3>
      <p># of users: { channel.numUsers } / { channel.capacity }</p>
    </div>
  )
};

export default Channel;