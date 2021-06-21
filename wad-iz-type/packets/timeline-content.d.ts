interface TimelineContentServerPacket extends ServerPacketBase {
  type: 'timeline-content';
  packet_id: number;
  content_id: string;
}

interface TimelineContentClientPacket extends ClientPacketBase {
  type: 'timeline-content';
  packet_id: number;
  content: string;
}
