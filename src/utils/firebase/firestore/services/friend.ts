import { fetchWithAuth } from './fetchWithAuth';

export async function makeFriend(friendId: string, senderId: string): Promise<boolean> {
  try {
    const ack = await fetchWithAuth('/api/friends', {
      method: 'POST',
      body: JSON.stringify({ friendId, senderId }),
    });
    console.log(ack.message);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function fetchFriends(senderId: string) {
  try {
    const friends = await fetchWithAuth(`/api/friends?senderId=${senderId}`, { method: 'GET' });
    console.log('fetchFriends', friends);
    return friends;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function checkIsMyFriend(uid: string, friendId: string) {
  try {
    const isMyFriend = await fetchWithAuth(`/api/friends?senderId=${uid}&friendId=${friendId}`, { method: 'GET' });
    console.log('checkIsMyFriend', isMyFriend.isMyFriend);
    return isMyFriend.isMyFriend;
  } catch (err) {
    console.error(err);
    return null;
  }
}