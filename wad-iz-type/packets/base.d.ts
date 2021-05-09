interface PacketBase {
  type: string;
}

interface ClientPacketBase extends PacketBase {
  packet_id: number;
}

interface ServerPacketBase extends PacketBase {
  packet_id: number | null;
}

type ClientPacket = TicketClientPacket | ProfileUpdateClientPacket;
type ServerPacket =
  | ConnectServerPacket
  | DailySyncServerPacket
  | DailyUpdateServerPacket
  | DirectSyncServerPacket
  | DisconnectServerPacket
  | MultipleConnectServerPacket
  | ProfileImageServerPacket
  | ProfileUpdateServerPacket
  | TicketServerPacket
  | TokenServerPacket
  | UserSyncServerPacket
  | WadizSyncServerPacket
  | WadizUpdateServerPacket
  | WelcomeServerPacket;
