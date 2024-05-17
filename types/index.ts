export type TChannel = {
  id: string,
  capacity: number,
  name: string,
  order: number
};
export type TChat = {
  id: string,
  capacity: number,
  cid: string,
  createdAt: FirestoreTimestamp,
  isPrivate: boolean,
  name: string,
  password: string,
  tag: string
};
export type TPrivateChat = {
  id: string,
  from: string,
  to: string,
  createdAt: FirestoreTimestamp
}
export type TMessage = {
  id: string,
  cid: string,
  createdAt: FirestoreTimestamp,
  sentBy: string,
  text: string
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
  cid: string;
  content: string;
  createdAt: FirestoreTimestamp;
  selected: boolean;
  tagOptions: string[];
};

export type FirestoreTimestamp = {
  seconds: number,
  nanoseconds: number
};