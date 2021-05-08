interface TicketClientPacket extends ClientPacketBase {
  type: 'ticket';
  ticket: string;
  token: string | null;
}

interface TicketServerPacket extends ServerPacketBase {
  type: 'ticket';
  nickname: string | null;
  profile_image: string | null;
}
