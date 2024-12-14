import { fetchWithAuth } from './fetchWithAuth';

interface SendMessageProps {
  uid: string;
  cid: string;
  senderName: string | null;
  senderPhotoURL: string | null;
  message: string;
};

export async function sendMessage({ uid, cid, senderName, senderPhotoURL, message }: SendMessageProps) {
  try {
    const sendMessageAck = await fetchWithAuth('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ uid, cid, senderName, senderPhotoURL, message }),
    });
    console.log(sendMessageAck);
    return sendMessageAck;
  } catch (err) {
    console.error(err);
    return null;
  }
};