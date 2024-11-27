import { fetchWithAuth } from './fetchWithAuth';

export async function sendMessage(
  uid: string,
  cid: string,
  senderName: string | null,
  senderPhotoURL: string | null,
  message: string
) {
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
}

export async function fetchLatestMessage(cid: string) {
  try {
    const data = await fetchWithAuth(`/api/messages/latest?cid=${cid}`, { method: 'GET' });
    console.log(data.latestMessage);
    return data.latestMessage;
  } catch (err) {
    console.error(err);
    return null;
  }
}