import { fetchWithAuth } from './fetchWithAuth';

export async function createChat(
  cid: string,
  uid: string,
  capacity: number,
  name: string,
  tag: string,
  isPrivate: boolean,
  password: string
) {
  try {
    const data = await fetchWithAuth('/api/chats', {
      method: 'POST',
      body: JSON.stringify({ cid, uid, capacity, name, tag, isPrivate, password }),
    });
    console.log(data.message);
    return data.cid;
  } catch (err) {
    console.error(err);
    return null;
  }
}

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
    const data = await fetchWithAuth(`/api/messages?cid=${cid}&latest=true`, { method: 'GET' });
    console.log(data.latestMessage);
    return data.latestMessage;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function updateChat(cid: string, uid: string, action: string): Promise<boolean> {
  try {
    const ack = await fetchWithAuth(`/api/chats/${cid}?action=${action}`, {
      method: 'PUT',
      body: JSON.stringify({ uid }),
    });
    console.log(ack.message);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}