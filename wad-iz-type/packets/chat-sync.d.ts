interface ChatSyncServerPacket extends ServerPacketBase {
  type: 'chat-sync';
  packet_id: null;
  chats: {
    user_id: string;
    nickname: string;
    profile_image: string;
    chat: Chat;
  }[];
}
