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

type Chat = TextChat | EmoticonChat | WadizUpdateChat;

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
