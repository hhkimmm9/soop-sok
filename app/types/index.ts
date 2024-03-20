export type TChannel = {
  'id': string,
  'capacity': number,
  'name': string,
  'numUsers': number
};
export type TChat = {
  'id': string,
  'capacity': number,
  'channelId': string,
  'createdAt': FirestoreTimestamp,
  'isPrivate': boolean,
  'name': string,
  'numUsers': string,
  'password': string
};
export type TMessage = {
  'id': string,
  'chatId': string,
  'createdAt': string,
  'sentBy': string,
  'text': string
};
export type TUser = {
  'createdAt': FirestoreTimestamp,
  'displayName': string,
  'email': string,
  'friendWith': string[],
  'honourPoints': number,
  'isEmailVerified': boolean,
  'isOnline': boolean,
  'lastLoginTime': string,
  'profile': {
    interests: string[],
    introduction: string,
  },
  'profilePicUrl': string,
  'uId': string
};

export type FirestoreTimestamp = {
  seconds: number,
  nanoseconds: number
};