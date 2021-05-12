interface HistoryItem {
  delta: number;
  time: number;
}

interface HistorySyncServerPacket extends ServerPacketBase {
  type: 'history-sync';
  packet_id: null;
  items: HistoryItem[];
}
