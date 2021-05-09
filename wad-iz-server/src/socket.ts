import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import App from './app';
import ProfileImage from './profile-image';

export enum SocketState {
  PENDING,
  DEFAULT,
  MASTER,
}

export default class Socket {
  public readonly ws: WebSocket;
  public readonly app: App;
  public state: SocketState;
  public ip: string | null;
  public userId: string | null;
  public nickname: string | null;
  public profileImage: string | null;

  constructor(ws: WebSocket, app: App) {
    this.ws = ws;
    this.app = app;
    this.state = SocketState.PENDING;
    this.ip = null;
    this.userId = null;
    this.nickname = null;
    this.profileImage = null;

    this.ws.addEventListener('close', () => this.app.onSocketDisconnect(this));
    this.ws.addEventListener('message', ({ data }) => {
      try {
        const json = JSON.parse(data);
        this.onPacket(json).catch(e => console.error(e));
      } catch (e) {}
    });
  }

  private async onPacket(packet: ClientPacket): Promise<any> {
    if (packet.type === 'ticket') {
      const sectors = packet.ticket.split('.');
      const data = sectors.slice(0, 2).join('.');
      const clientHash = sectors[2];
      const serverHash = crypto
        .createHash('sha256')
        .update(data + process.env.SECRET)
        .digest('base64');
      if (clientHash !== serverHash) return false;

      const ip = Buffer.from(sectors[0], 'base64').toString('utf-8');
      this.ip = ip;

      if (packet.token) {
        jwt.verify(packet.token, process.env.SECRET!, (err, decoded: any) => {
          if (err) throw new Error();
          const connectedUser = this.app.getUserId(decoded.user_id);
          if (connectedUser) {
            connectedUser.closeForMultipleConnect();
          }
          this.userId = decoded.user_id || null;
          this.nickname = decoded.nickname || null;
          this.profileImage = decoded.profile_image || null;
        });
      } else {
        const userId = crypto.randomBytes(8).toString('hex');
        const nickname = `WIZ-${Math.round(Math.random() * 10000)
          .toString()
          .padStart(4, '0')}`;
        const profileImage = 'logo.iz.1';
        this.userId = userId;
        this.nickname = nickname;
        this.profileImage = profileImage;
        const token = jwt.sign(
          { user_id: this.userId, nickname: this.nickname, profile_image: this.profileImage },
          process.env.SECRET!
        );
        this.sendToken(token);
      }

      this.state = SocketState.DEFAULT;
      this.app.onSocketEstablished(this, packet.packet_id);
    }

    if (packet.type === 'profile-update') {
      const nickname = packet.nickname;
      const profileImage = packet.profile_image;

      if (nickname.length > 12) return false;
      if (profileImage.length > 50) return false;

      this.nickname = nickname;
      this.profileImage = profileImage;

      this.app.onProfileUpdate(this.userId!, this.nickname, this.profileImage);

      const token = jwt.sign(
        { user_id: this.userId, nickname: this.nickname, profile_image: this.profileImage },
        process.env.SECRET!
      );
      this.sendToken(token);
    }

    if (packet.type === 'chat') {
      this.app.onChatReceive(this.userId!, packet.chat);
    }
  }

  private sendJson(json: any): void {
    this.ws.send(JSON.stringify(json));
  }

  private sendPacket(packet: ServerPacketBase): void {
    this.sendJson(packet);
  }

  public sendWelcome(): void {
    const packet: WelcomeServerPacket = {
      type: 'welcome',
      packet_id: null,
      server_time: new Date().getTime(),
    };
    this.sendPacket(packet);
  }

  public sendToken(token: string): void {
    const packet: TokenServerPacket = {
      type: 'token',
      packet_id: null,
      token,
    };
    this.sendPacket(packet);
  }

  public sendTicket(packetId: number): void {
    const packet: TicketServerPacket = {
      type: 'ticket',
      packet_id: packetId,
      user_id: this.userId!,
      nickname: this.nickname!,
      profile_image: this.profileImage!,
    };
    this.sendPacket(packet);
  }

  public closeForMultipleConnect(): void {
    const packet: MultipleConnectServerPacket = {
      type: 'multiple-connect',
      packet_id: null,
    };
    this.sendPacket(packet);
    this.state = SocketState.PENDING;
    this.userId = null;
  }

  public sendConnect(userId: string, nickname: string, profileImage: string): void {
    const packet: ConnectServerPacket = {
      type: 'connect',
      packet_id: null,
      user_id: userId,
      nickname: nickname,
      profile_image: profileImage,
    };
    this.sendPacket(packet);
  }

  public sendDisconnect(userId: string): void {
    const packet: DisconnectServerPacket = {
      type: 'disconnect',
      packet_id: null,
      user_id: userId,
    };
    this.sendPacket(packet);
  }

  public sendUserSync(users: IUser[]): void {
    users = users.filter(user => user.user_id !== this.userId);
    const packet: UserSyncServerPacket = {
      type: 'user-sync',
      packet_id: null,
      users,
    };
    this.sendPacket(packet);
  }

  public sendWadizUpdate(
    amount: number,
    supporter: number,
    amountDelta: number,
    supporterDelta: number
  ): void {
    const packet: WadizUpdateServerPacket = {
      type: 'wadiz-update',
      packet_id: null,
      amount,
      supporter,
      amount_delta: amountDelta,
      supporter_delta: supporterDelta,
    };
    this.sendPacket(packet);
  }

  public sendWadizSync(): any {
    if (this.app.amount === null || this.app.supporter === null) return false;
    const packet: WadizSyncServerPacket = {
      type: 'wadiz-sync',
      packet_id: null,
      amount: this.app.amount,
      supporter: this.app.supporter,
    };
    this.sendPacket(packet);
  }

  public sendDirectSync(amount: number, lastUpdate: string): void {
    const packet: DirectSyncServerPacket = {
      type: 'direct-sync',
      packet_id: null,
      amount: amount,
      last_update: lastUpdate,
    };
    this.sendPacket(packet);
  }

  public sendDailyUpdate(up: number, down: number): any {
    const packet: DailyUpdateServerPacket = {
      type: 'daily-update',
      packet_id: null,
      up,
      down,
    };
    this.sendPacket(packet);
  }

  public sendDailySync(): any {
    if (this.app.dailyUp === null || this.app.dailyDown === null) return false;
    const packet: DailySyncServerPacket = {
      type: 'daily-sync',
      packet_id: null,
      up: this.app.dailyUp,
      down: this.app.dailyDown,
    };
    this.sendPacket(packet);
  }

  public sendProfileImage(): void {
    const images: IProfileImage[] = [];
    for (const top of Object.keys(ProfileImage)) {
      for (const middle of Object.keys(ProfileImage[top])) {
        const items = ProfileImage[top][middle];
        for (const item of items) {
          const key = `${top}.${middle}.${item}`;
          images.push({ key, url: `http://lt2.kr/image/${key}.png` });
        }
      }
    }
    const packet: ProfileImageServerPacket = {
      type: 'profile-image',
      packet_id: null,
      images,
    };
    this.sendPacket(packet);
  }

  public sendProfileUpdate(userId: string, nickname: string, profileImage: string): void {
    const packet: ProfileUpdateServerPacket = {
      type: 'profile-update',
      packet_id: null,
      user_id: userId,
      nickname: nickname,
      profile_image: profileImage,
    };
    this.sendPacket(packet);
  }

  public sendChat(userId: string, chat: Chat): void {
    const packet: ChatServerPacket = {
      type: 'chat',
      packet_id: null,
      user_id: userId,
      chat: chat,
    };
    this.sendPacket(packet);
  }
}
