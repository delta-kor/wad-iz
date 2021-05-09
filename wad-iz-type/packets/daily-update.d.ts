interface DailyUpdateServerPacket extends ServerPacketBase {
  type: 'daily-update';
  packet_id: null;
  up: number;
  down: number;
}
