interface DirectSyncServerPacket extends ServerPacketBase {
  type: 'direct-sync';
  packet_id: null;
  amount: number;
  last_update: string;
}
