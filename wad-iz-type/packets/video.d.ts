type VideoServerPacket = StopVideoServerPacket | PlayVideoServerPacket;

interface VideoState {
  active: boolean;
  service?: 'youtube';
  id?: string;
  isLive?: boolean;
  time?: number;
}

interface StopVideoServerPacket extends ServerPacketBase {
  type: 'video';
  packet_id: null;
  operation: 'stop';
}

interface PlayVideoServerPacket extends ServerPacketBase {
  type: 'video';
  packet_id: null;
  operation: 'play';
  service: 'youtube';
  id: string;
  is_live: boolean;
  time: number;
}
