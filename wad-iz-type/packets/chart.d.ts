interface ChartServerPacket extends ServerPacketBase {
  type: 'chart';
  packet_id: null;
  data: number[];
  timestamp: number[];
}