type TimelineItem = TimelineUrlItem | TimelineArticleItem;

interface TimelineItemBase {
  type: string;
  date: string;
  title: string;
  description: string;
  action: string;
}

interface TimelineUrlItem extends TimelineItemBase {
  action: 'url';
  url: string;
}

interface TimelineArticleItem extends TimelineItemBase {
  action: 'article';
  content_id: string;
}

interface TimelineServerPacket extends ServerPacketBase {
  type: 'timeline';
  packet_id: number;
  timeline: TimelineItem[];
}

interface TimelineClientPacket extends ClientPacketBase {
  type: 'timeline';
  packet_id: number;
}
