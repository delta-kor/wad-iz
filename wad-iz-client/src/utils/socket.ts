import EventEmitter from 'events';

interface PacketPromise {
  packetId: number;
  resolve: any;
}

export default class Socket extends EventEmitter {
  private ws!: WebSocket;
  private resolves!: PacketPromise[];
  private packetId!: number;

  public userId: string | null = null;
  public nickname: string | null = null;
  public profileImage: string | null = null;

  constructor() {
    super();
    fetch('http://lt2.kr/ws?p=' + new Date().getTime())
      .then(res => res.text())
      .then(url => {
        if (window.location.hostname === 'localhost') url = 'ws://localhost/';
        this.ws = new WebSocket(url);
        this.resolves = [];
        this.packetId = 1;
        this.mountEventListeners();
      });
  }

  private mountEventListeners(): void {
    this.ws.addEventListener('open', async () => {
      const ticket = await this.createTicket();
      const packet: TicketClientPacket = {
        type: 'ticket',
        packet_id: this.packetId,
        ticket,
        token: localStorage.getItem('token'),
      };
      const response = await this.request<TicketServerPacket>(packet);
      this.userId = response.user_id;
      this.nickname = response.nickname;
      this.profileImage = response.profile_image;
    });

    this.ws.addEventListener('message', ({ data: text }) => {
      const data = JSON.parse(text) as ServerPacket;
      for (const resolve of this.resolves) {
        if (resolve.packetId === data.packet_id) resolve.resolve(data);
      }

      this.emit(data.type, data);
    });

    this.ws.addEventListener('open', () => {
      this.emit('#server-open');
    });

    this.ws.addEventListener('close', () => {
      this.emit('#server-close');
    });

    this.ws.addEventListener('error', () => {
      this.emit('#server-error');
    });
  }

  private sendJson(json: any): void {
    this.ws.send(JSON.stringify(json));
  }

  private sendPacket(packet: ServerPacketBase): void {
    this.sendJson(packet);
    this.packetId++;
  }

  private request<T extends ServerPacket>(packet: ClientPacket): Promise<T> {
    this.sendPacket(packet);
    return new Promise(resolve => {
      this.resolves.push({
        packetId: packet.packet_id,
        resolve,
      });
    });
  }

  private async createTicket(): Promise<string> {
    const response = await fetch('http://lt2.kr/ticket.php');
    const data = await response.text();
    return data;
  }

  public updateProfile(nickname: string, profileImage: string): void {
    const packet: ProfileUpdateClientPacket = {
      type: 'profile-update',
      packet_id: this.packetId,
      nickname: nickname,
      profile_image: profileImage,
    };
    this.sendPacket(packet);
  }

  public sendTextChat(text: string): void {
    const packet: ChatClientPacket = {
      type: 'chat',
      packet_id: this.packetId,
      chat: {
        type: 'text',
        content: text,
      },
    };
    this.sendPacket(packet);
  }

  public sendEmoticonChat(key: string): void {
    const packet: ChatClientPacket = {
      type: 'chat',
      packet_id: this.packetId,
      chat: {
        type: 'emoticon',
        key: key,
      },
    };
    this.sendPacket(packet);
  }
}
