interface TextChat {
  type: 'text';
  content: string;
}

interface EmoticonChat {
  type: 'emoticon';
  key: string;
}

interface WadizUpdateChat {
  type: 'wadiz-update';
  delta: number;
}

interface ChatClearChat {
  type: 'chat-clear';
}

interface FeedChat {
  type: 'feed';
  content: string;
}

interface InstagramPostUpdateChat {
  type: 'ig-photo-update';
  username: string;
  profile_image: string;
  url: string;
}

interface InstagramStoryUpdateChat {
  type: 'ig-story-update';
  username: string;
  profile_image: string;
  url: string;
}

interface TweetInChat {
  type: 'tweet-in';
  name: string;
  rank: number;
}

interface TweetUpdateChat {
  type: 'tweet-update';
  name: string;
  from: number;
  to: number;
}

interface TweetOutChat {
  type: 'tweet-out';
  name: string;
}

type Chat =
  | TextChat
  | EmoticonChat
  | WadizUpdateChat
  | ChatClearChat
  | FeedChat
  | InstagramPostUpdateChat
  | InstagramStoryUpdateChat
  | TweetInChat
  | TweetUpdateChat
  | TweetOutChat;

interface ChatClientPacket extends ClientPacketBase {
  type: 'chat';
  packet_id: number;
  chat: Chat;
}

interface ChatServerPacket extends ServerPacketBase {
  type: 'chat';
  packet_id: null;
  user_id: string;
  role: number;
  nickname: string;
  profile_image: string;
  chat: Chat;
}
