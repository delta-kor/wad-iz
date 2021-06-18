type RadioServerPacket = PlayRadioServerPacket | StopRadioServerPacket;

type RadioState = InactiveRadioState | ActiveRadioState;

interface Album {
  title: string;
  imageUrl: string;
}

interface Music {
  id: string;
  title: string;
  subtitle?: string;
  album: Album;
  lyrics: Lyrics;
  length: number;
  isJapanese: boolean;
}

interface InactiveRadioState {
  active: false;
}

interface ActiveRadioState {
  active: true;
  music: Music;
  vote: VoteItem[];
  until: number;
  time: number;
}

interface StopRadioServerPacket extends ServerPacketBase {
  type: 'radio';
  packet_id: null;
  operation: 'stop';
}

interface PlayRadioServerPacket extends ServerPacketBase {
  type: 'radio';
  packet_id: null;
  operation: 'play';
  id: string;
  title: string;
  subtitle?: string;
  album_title: string;
  image_url: string;
  lyrics: Lyrics;
  length: number;
  time: number;
  isJapanese: boolean;
}
