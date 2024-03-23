export type TChannel = {
  id: string,
  capacity: number,
  name: string,
  numUsers: number
};
export type TChat = {
  id: string,
  capacity: number,
  channelId: string,
  createdAt: FirestoreTimestamp,
  isPrivate: boolean,
  name: string,
  numUsers: string,
  password: string
};
export type TPrivateChat = {
  id: string,
  from: string,
  to: string,
  createdAt: FirestoreTimestamp
}
export type TMessage = {
  id: string,
  chatId: string,
  createdAt: FirestoreTimestamp,
  sentBy: string,
  text: string
};
export type TUser = {
  id: string,
  createdAt: FirestoreTimestamp,
  displayName: string,
  email: string,
  friendWith: string[],
  honourPoints: number,
  isEmailVerified: boolean,
  isOnline: boolean,
  lastLoginTime: string,
  profile: {
    interests: string[],
    introduction: string,
  },
  profilePicUrl: string,
  uId: string
};

export type FirestoreTimestamp = {
  seconds: number,
  nanoseconds: number
};