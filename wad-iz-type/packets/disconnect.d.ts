interface DisconnectServerPacket extends ServerPacketBase {
  type: 'disconnect';
  packet_id: null;
  user_id: string;
}
