import { apiReqWithAuth } from './apiReqWithAuth';

export async function getOrCreateChatId(myId: string, friendId: string) {
  if (!myId || !friendId) return null;

  try {
    const url = `/api/private-chats?myId=${myId}&friendId=${friendId}`;

    let data = await apiReqWithAuth(url, { method: 'GET' });
    console.log(data.message);

    if (!data.id) {
      data = await apiReqWithAuth(url, { method: 'POST' });
      console.log(data.message);
    }

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};