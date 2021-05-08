interface TicketClientPacket extends ClientPacketBase {
  type: 'ticket';
  ticket: string;
  token: string | null;
}

interface TicketServerPacket extends ServerPacketBase {
  type: 'ticket';
  packet_id: number;
  user_id: string;
  nickname: string | null;
  profile_image: string | null;
}
