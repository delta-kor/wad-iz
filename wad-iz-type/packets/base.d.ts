interface PacketBase {
  type: string;
}

interface ClientPacketBase extends PacketBase {
  packet_id: number;
}

interface ServerPacketBase extends PacketBase {
  packet_id: number | null;
}

type ClientPacket = TicketClientPacket;
type ServerPacket =
  | ConnectServerPacket
  | DirectSyncServerPacket
  | UserSyncServerPacket
  | TicketServerPacket
  | TokenServerPacket
  | WadizSyncServerPacket
  | WadizUpdateServerPacket
  | WelcomeServerPacket;
