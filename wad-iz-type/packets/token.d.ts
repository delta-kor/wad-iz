interface TokenServerPacket extends ServerPacketBase {
  type: 'token';
  packet_id: null;
  token: string;
}
