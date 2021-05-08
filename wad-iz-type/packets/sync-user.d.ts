interface ISyncUser {
  user_id: string;
  nickname: string | null;
  profile_image: string | null;
}

interface SyncUserServerPacket extends ServerPacketBase {
  type: 'sync-user';
  packet_id: null;
  users: ISyncUser[];
}
