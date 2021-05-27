interface InstagramProfileClientPacket extends ClientPacketBase {
  type: 'instagram-profile';
}

interface InstagramProfile {
  username: string;
  profile_image: string;
  member_name: string;
}

interface InstagramProfileServerPacket extends ServerPacketBase {
  type: 'instagram-profile';
  packet_id: number;
  profiles: InstagramProfile[];
}
