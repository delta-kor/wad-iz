type VideoServerPacket = StopVideoServerPacket | PlayVideoServerPacket | MultiPlayVideoServerPacket;

interface VideoState {
  active: boolean;
  service?: 'youtube' | 'url';
  isMulti?: boolean;
  id?: string | string[];
  name?: string[];
  sync?: number[];
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
  service: 'youtube' | 'url';
  id: string;
  is_live: boolean;
  time: number;
}

interface MultiPlayVideoServerPacket extends ServerPacketBase {
  type: 'video';
  packet_id: null;
  operation: 'multi-play';
  service: 'youtube' | 'url';
  id: string[];
  name: string[];
  sync: number[];
  time: number;
}
