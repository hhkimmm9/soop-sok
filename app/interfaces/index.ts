export interface IMessage {
  '_id': string;
  'sentBy': string;
  'content': string;
};
export interface IChat {
  '_id': string;
  'title': string;
  'topic': string;
  'capacity': number;
  'occupiedBy': number;
  'createdAt': number;
};
export interface IChannel {
  'id': string;
  'capacity': number;
  'name': string;
  'numUsers': number;
};