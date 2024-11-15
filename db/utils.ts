import { TUser } from '@/types';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get('auth-token');

async function fetchWithAuth(url: string, options: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export async function registerUserWithUID(
  displayName: string,
  email: string,
  photoURL: string,
  uid: string
): Promise<boolean> {
  try {
    const ack = await fetchWithAuth(`/api/users/${uid}`, {
      method: 'POST',
      body: JSON.stringify({ displayName, email, photoURL }),
    });
    console.log(ack.message);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function updateUserStatus(uid: string, status: string): Promise<boolean> {
  try {
    const ack = await fetchWithAuth(`/api/users/${uid}?type=${status}`, { method: 'PUT' });
    console.log(ack.message);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function updateUserProfile(uid: string, user: TUser): Promise<boolean> {
  try {
    const ack = await fetchWithAuth(`/api/users/${uid}`, {
      method: 'PUT',
      body: JSON.stringify({ user }),
    });
    console.log('updateUserProfile >> ', ack.message);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function fetchUser(uid: string): Promise<TUser | null> {
  try {
    const user = await fetchWithAuth(`/api/users/${uid}`, { method: 'GET' });
    console.log('fetchUser', user);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
}

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

export async function addBanner(cid: string, content: string, tagOptions: string[]): Promise<boolean> {
  try {
    const addBannerAck = await fetchWithAuth('/api/banners', {
      method: 'POST',
      body: JSON.stringify({ cid, content, tagOptions }),
    });
    console.log(addBannerAck);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getBanner() {
  try {
    const banner = await fetchWithAuth('/api/banners', { method: 'GET' });
    console.log('getBanner', banner);
    return banner;
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
