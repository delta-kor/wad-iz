interface WadizSyncServerPacket extends ServerPacketBase {
  type: 'wadiz-sync';
  packet_id: null;
  amount: number;
  supporter: number;
}
