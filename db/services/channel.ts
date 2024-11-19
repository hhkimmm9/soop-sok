import { fetchWithAuth } from './fetchWithAuth';

export async function fetchChannels() {
  try {
    const channels = await fetchWithAuth('/api/channels', { method: 'GET' });
    console.log('fetchChannels', channels);
    return channels;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function updateChannel(cid: string, uid: string, action: string): Promise<boolean> {
  try {
    const ack = await fetchWithAuth(`/api/channels/${cid}?action=${action}`, {
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