interface WeeklyItem {
  day: number;
  amount: number;
  isToday: boolean;
}

interface WeeklySyncServerPacket extends ServerPacketBase {
  type: 'weekly-sync';
  packet_id: null;
  items: WeeklyItem[];
}
