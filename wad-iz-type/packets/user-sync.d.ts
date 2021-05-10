interface IUser {
  user_id: string;
  role: number;
  nickname: string;
  profile_image: string;
}

interface UserSyncServerPacket extends ServerPacketBase {
  type: 'user-sync';
  packet_id: null;
  users: IUser[];
}
