interface ChartServerPacket extends ServerPacketBase {
  type: 'chart';
  packet_id: null;
  data: number[];
  timestamp: number[];
}

interface CandleData {
  to: number;
  from: number;
  delta: number;
  timestamp: Date;
}
