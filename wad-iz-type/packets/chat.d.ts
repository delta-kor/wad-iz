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

type Chat = TextChat | EmoticonChat;

interface ChatClientPacket extends ClientPacketBase {
  type: 'chat';
  packet_id: number;
  chat: Chat;
}

interface ChatServerPacket extends ServerPacketBase {
  type: 'chat';
  packet_id: null;
  user_id: string;
  chat: Chat;
}
