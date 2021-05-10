interface TicketClientPacket extends ClientPacketBase {
  type: 'ticket';
  ticket: string;
  token: string | null;
}

interface TicketServerPacket extends ServerPacketBase {
  type: 'ticket';
  packet_id: number;
  user_id: string;
  role: number;
  nickname: string;
  profile_image: string;
}
