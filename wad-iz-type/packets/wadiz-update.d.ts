interface WadizUpdateServerPacket extends ServerPacketBase {
  type: 'wadiz-update';
  packet_id: null;
  amount: number;
  supporter: number;
  amount_delta: number;
  supporter_delta: number;
  timestamp: number;
}
