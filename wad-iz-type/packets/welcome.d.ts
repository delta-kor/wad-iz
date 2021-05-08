interface WelcomeServerPacket extends ServerPacketBase {
  type: 'welcome';
  packet_id: null;
  server_time: number;
}
