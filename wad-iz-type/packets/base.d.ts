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
  | InstagramProfileClientPacket
  | ProfileUpdateClientPacket
  | TicketClientPacket;

type ServerPacket =
  | ChatClearServerPacket
  | ChatServerPacket
  | ChatSyncServerPacket
  | ConnectServerPacket
  | DirectSyncServerPacket
  | DisconnectServerPacket
  | EmoticonSyncServerPacket
  | InstagramProfileServerPacket
  | MultipleConnectServerPacket
  | ProfileImageServerPacket
  | ProfileUpdateServerPacket
  | ReloadServerPacket
  | TicketServerPacket
  | TokenServerPacket
  | UserSyncServerPacket
  | VideoServerPacket
  | WadizSyncServerPacket
  | WadizUpdateServerPacket
  | WelcomeServerPacket;
