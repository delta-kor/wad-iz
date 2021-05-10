interface TextChat {
  type: 'text';
  content: string;
}

interface EmoticonChat {
  type: 'emoticon';
  uuid: string;
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
  nickname: string;
  profile_image: string;
  chat: Chat;
}
