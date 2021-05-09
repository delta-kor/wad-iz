interface ProfileUpdateClientPacket extends ClientPacketBase {
  type: 'profile-update';
  packet_id: number;
  nickname: string;
  profile_image: string;
}

interface ProfileUpdateServerPacket extends ServerPacketBase {
  type: 'profile-update';
  packet_id: null;
  user_id: string;
  nickname: string;
  profile_image: string;
}
