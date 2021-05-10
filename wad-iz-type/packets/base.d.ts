interface PacketBase {
  type: string;
}

interface ClientPacketBase extends PacketBase {
  packet_id: number;
}

interface ServerPacketBase extends PacketBase {
  packet_id: number | null;
}

type ClientPacket = ChatClientPacket | ProfileUpdateClientPacket | TicketClientPacket;
type ServerPacket =
  | ChatServerPacket
  | ChatSyncServerPacket
  | ConnectServerPacket
  | DailySyncServerPacket
  | DailyUpdateServerPacket
  | DirectSyncServerPacket
  | DisconnectServerPacket
  | EmoticonSyncServerPacket
  | MultipleConnectServerPacket
  | ProfileImageServerPacket
  | ProfileUpdateServerPacket
  | TicketServerPacket
  | TokenServerPacket
  | UserSyncServerPacket
  | VideoServerPacket
  | WadizSyncServerPacket
  | WadizUpdateServerPacket
  | WelcomeServerPacket;
