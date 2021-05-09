interface IUser {
  user_id: string;
  nickname: string | null;
  profile_image: string | null;
}

interface UserSyncServerPacket extends ServerPacketBase {
  type: 'user-sync';
  packet_id: null;
  users: IUser[];
}
