interface ConnectServerPacket extends ServerPacketBase {
  type: 'connect';
  packet_id: null;
  user_id: string;
  nickname: string;
  profile_image: string;
}
