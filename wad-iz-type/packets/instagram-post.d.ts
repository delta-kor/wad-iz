interface InstagramPostClientPacket extends ClientPacketBase {
  type: 'instagram-post';
  username: string;
}

interface InstagramPost {
  photos: string[];
  content?: string;
  likes: number;
  timestamp: number;
  width: number;
  height: number;
}

interface InstagramPostServerPacket extends ServerPacketBase {
  type: 'instagram-post';
  packet_id: number;
  posts: InstagramPost[];
}
