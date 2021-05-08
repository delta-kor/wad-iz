import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import App from './app';

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
      } catch (e) {
        console.error(e);
      }
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
          this.userId = decoded.user_id || null;
          this.nickname = decoded.nickname || null;
          this.profileImage = decoded.profile_image || null;
        });
      } else {
        const userId = crypto.randomBytes(8).toString('hex');
        this.userId = userId;
        const token = jwt.sign(
          { user_id: userId, nickname: null, profile_image: null },
          process.env.SECRET!
        );
        this.sendToken(token);
      }

      this.state = SocketState.DEFAULT;
      this.app.onSocketEstablished(this);
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

  public sendConnect(userId: string, nickname: string | null, profileImage: string | null): void {
    const packet: ConnectServerPacket = {
      type: 'connect',
      packet_id: null,
      user_id: userId,
      nickname: nickname,
      profile_image: profileImage,
    };
    this.sendPacket(packet);
  }
}
