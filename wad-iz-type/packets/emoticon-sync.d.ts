interface EmoticonSet {
  title: string;
  cons: Emoticon[];
}

interface Emoticon {
  key: string;
  url: string;
}

interface EmoticonSyncServerPacket extends ServerPacketBase {
  type: 'emoticon-sync';
  packet_id: null;
  emoticons: EmoticonSet[];
}
