export type IChannel = {
  'id': string;
  'capacity': number;
  'name': string;
  'numUsers': number;
};
export type IChat = {
  'id': string;
  'capacity': number;
  'channelId': string;
  'createdAt': FirestoreTimestamp;
  'name': string;
  'numUsers': string;
};
export type IMessage = {
  'id': string;
  'chatId': string;
  'createdAt': string;
  'sentBy': string;
  'text': string;
};
export type IUser = {
  'id': string;
  'createdAt': FirestoreTimestamp;
  'displayName': string;
  'email': string;
  'friendWith': string[];
  'honourPoints': number;
  'isEmailVerified': boolean;
  'isOnline': boolean;
  'lastLoginTime': string;
  'profile': string;
  'profilePicUrl': string;
  'uId': string;
  'username': string;
};

export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};