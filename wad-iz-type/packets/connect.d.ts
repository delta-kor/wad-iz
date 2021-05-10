interface ConnectServerPacket extends ServerPacketBase {
  type: 'connect';
  packet_id: null;
  user_id: string;
  role: number;
  nickname: string;
  profile_image: string;
}
