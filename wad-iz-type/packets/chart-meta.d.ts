interface ChartMeta {
  total: number;
  delta: number;
  delta_percent: number;
  highest: number;
  lowest: number;
  volume: number;
  order: number;
  cancel: number;
}

interface ChartMetaServerPacket extends ServerPacketBase {
  type: 'chart-meta';
  packet_id: null;
  meta: ChartMeta;
}
