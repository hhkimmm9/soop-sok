export type TChannel = {
  id: string,
  capacity: number,
  members: string[],
  name: string,
  numMembers: number,
  order: number,
  updatedAt: FirestoreTimestamp
};
export type TChat = {
  id: string,
  capacity: number,
  cid: string,
  createdAt: FirestoreTimestamp,
  isPrivate: boolean,
  members: string[],
  name: string,
  numMembers: number,
  password: string,
  tag: string,
  updatedAt: FirestoreTimestamp
};
export type TPrivateChat = {
  id: string,
  from: string,
  to: string,
  createdAt: FirestoreTimestamp
};
export type TMessage = {
  id: string,
  uid: string,
  senderName: string,
  senderPhotoURL: string,
  message: string,
  cid: string,
  createdAt: FirestoreTimestamp
};
export type TUser = {
  createdAt: FirestoreTimestamp,
  displayName: string,
  email: string,
  isOnline: boolean,
  lastLoginTime: FirestoreTimestamp,
  photoURL: string,
  profile: {
    interests: string[],
    introduction: string,
    mbti: string,
  },
  uid: string
};
export type TBanner = {
  cid: string,
  content: string,
  createdAt: FirestoreTimestamp,
  selected: boolean,
  tagOptions: string[]
};
export type TFriend = {
  createdAt: FirestoreTimestamp,
  friendId: string,
  id: string,
  senderId: string
};
export type FirestoreTimestamp = {
  _seconds: number,
  _nanoseconds: number
};