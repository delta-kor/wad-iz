interface IProfileImage {
  key: string;
  url: string;
}

interface ProfileImageServerPacket extends ServerPacketBase {
  type: 'profile-image';
  images: IProfileImage[];
}
