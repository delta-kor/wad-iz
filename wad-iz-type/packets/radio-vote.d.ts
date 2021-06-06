interface VoteItem {
  music: Music;
  voter: string[];
}

interface RadioVoteClientPacket extends ClientPacketBase {
  type: 'radio-vote';
  packet_id: number;
  vote: string;
}

type RadioVoteServerPacket = RadioVoteDataServerPacket | RadioVoteEndedServerPacket;

interface RadioVoteDataServerPacket extends ServerPacketBase {
  type: 'radio-vote';
  packet_id: null;
  operation: 'data';
  votes: VoteItem[];
  until: number;
}

interface RadioVoteEndedServerPacket extends ServerPacketBase {
  type: 'radio-vote';
  packet_id: null;
  operation: 'result';
  result: Music;
}
