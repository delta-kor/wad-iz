interface PacketBase {
  type: string;
}

interface ClientPacketBase extends PacketBase {
  packet_id: number;
}

interface ServerPacketBase extends PacketBase {
  packet_id: number | null;
}

type ClientPacket =
  | ChatClientPacket
  | InstagramPostClientPacket
  | InstagramProfileClientPacket
  | ProfileUpdateClientPacket
  | RadioVoteClientPacket
  | TicketClientPacket;

type ServerPacket =
  | ChatClearServerPacket
  | ChatServerPacket
  | ChatSyncServerPacket
  | ConnectServerPacket
  | DirectSyncServerPacket
  | DisconnectServerPacket
  | EmoticonSyncServerPacket
  | InstagramPostServerPacket
  | InstagramProfileServerPacket
  | MultipleConnectServerPacket
  | ProfileImageServerPacket
  | ProfileUpdateServerPacket
  | RadioVoteServerPacket
  | RadioServerPacket
  | ReloadServerPacket
  | TicketServerPacket
  | TokenServerPacket
  | UserSyncServerPacket
  | VideoServerPacket
  | WadizSyncServerPacket
  | WadizUpdateServerPacket
  | WelcomeServerPacket;
