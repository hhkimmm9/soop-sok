import { useState } from 'react';
import useDialog from '@/utils/dispatcher';
import { auth } from '@/utils/firebase/firebase';
import { sendMessage } from '@/utils/firebase/firestore/services';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

type MessageInputProps = {
  cid: string;
};

const MessageInput = ({ cid }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const { messageDialog } = useDialog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth?.currentUser || !message.trim()) return;

    const { uid, displayName: senderName, photoURL: senderPhotoURL } = auth.currentUser;

    try {
      await sendMessage(uid, cid, senderName, senderPhotoURL, message.trim());
      setMessage('');
    } catch (err) {
      console.error(err);
      messageDialog.show('general');
    }
  };

  return (
    <div className="grow flex gap-3 items-center">
      <div className="grow p-0.5 rounded-lg shadow-sm bg-white">
        <form onSubmit={handleSubmit} className="h-8 flex items-center justify-between">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="grow px-2 py-1 outline-none"
          />
          <button type="submit" className="mr-2">
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
