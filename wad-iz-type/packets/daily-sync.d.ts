interface DailySyncServerPacket extends ServerPacketBase {
  type: 'daily-sync';
  packet_id: null;
  up: number;
  down: number;
}
