import { TUser } from '@/types';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const token = cookies.get('auth-token');

export async function registerUserWithUID(
  displayName: string,
  email: string,
  photoURL: string,
  uid: string
): Promise<boolean | null> {
  console.log("storeUsers", uid);
  try {
    const res = await fetch(`/api/users/${uid}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName,
        email,
        photoURL
      })
    });
    const ack = await res.json();
    console.log(ack.message);

    if (!ack.ok) return false;

    return true;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function updateUserStatus(
  uid: string,
  status: string,
): Promise<boolean | null> {
  try {
    const res = await fetch(`/api/users/${uid}?type=${status}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const ack = await res.json();
    console.log(ack.message);
    
    if (!ack.ok) return false;

    return true;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function updateUserProfile(
  uid: string,
  user: TUser,
): Promise<boolean | null> {
  try {
    const res = await fetch(`/api/users/${uid}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user
      })
    });
    const ack = await res.json();
    console.log('updateUserProfile >> ', ack.message);

    return true;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function fetchUser(uid: string): Promise<TUser | null> {
  try {
    const res = await fetch(`/api/users/${uid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const user = await res.json();
    console.log('fetchUser', user);

    if (!user) return null;
    return user;
  }

  catch (err) {
    console.error(err);
    return null;
  }
};

export async function fetchChannels() {
  try {
    const res = await fetch('/api/channels', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const channels = await res.json();
    console.log('fetchChannels', channels);
    return channels;
  } catch (err) {
    console.error(err);
    return null;
  }
};

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
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cid,
        uid,
        capacity,
        name,
        tag,
        isPrivate,
        password
      })
    });
    const data = await res.json();
    console.log(data.message);

    return data.cid;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function addBanner(
  cid: string,
  content: string,
  tagOptions: string[]
): Promise<boolean | null> {
  try {
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cid, content, tagOptions
      })
    });
    const addBannerAck = await res.json();
    console.log(addBannerAck);
    return true;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function getBanner() {
  try {
    const res = await fetch('/api/banners', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const banner = await res.json();
    console.log('getBanner', banner);
    return banner;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function sendMessage(
  uid: string,
  cid: string,
  senderName: string | null,
  senderPhotoURL: string | null,
  message: string
) {
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid, cid, senderName, senderPhotoURL, message
      })
    });
    const sendMessageAck = await res.json();
    console.log(sendMessageAck);
    return sendMessageAck;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function fetchLatestMessage(cid: string) {
  try {
    const res = await fetch(`/api/messages?cid=${cid}&latest=true`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    
    const data = await res.json();

    console.log(data.latestMessage);
    return data.latestMessage;
  } catch (err) {
    console.error(err);
    return null
  }
};

export async function makeFriend(friendId: string, senderId: string): Promise<Boolean> {
  try {
    const res = await fetch('/api/friends', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ friendId, senderId })
    });

    const ack = await res.json();
    console.log(ack.message);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export async function fetchFriends(senderId: string) {
  try {
    const res = await fetch(`/api/friends?senderId=${senderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const friends = await res.json();
    console.log('fetchFriends', friends);

    if (!res.ok) {
      return [];
    }

    return friends;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function checkIsMyFriend(uid: string, friendId: string) {
  try {
    const res = await fetch(`/api/friends?senderId=${uid}&friendId=${friendId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const isMyFriend = await res.json();
    console.log('checkIsMyFriend', isMyFriend.isMyFriend);

    return isMyFriend.isMyFriend;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export async function enterChat(cid: string, uid: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/chats/${cid}?action=enter`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid })
    });
    const ack = await res.json();
    console.log(ack.message);

    if (!res.ok) {
      // TODO: handle error - chat is full.
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export async function leaveChat(cid: string, uid: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/chats/${cid}?action=leave`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid })
    });

    if (!res.ok) {
      // 
    }

    const ack = await res.json();
    console.log(ack.message);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export async function enterChannel(cid: string, uid: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/channels/${cid}?action=enter`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid })
    });

    if (!res.ok) {
      // 
    }

    const ack = await res.json();
    console.log(ack.message);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export async function leaveChannel(cid: string, uid: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/channels/${cid}?action=leave`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid })
    });

    if (!res.ok) {
      // 
    }

    const ack = await res.json();
    console.log(ack.message);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};