import { Server } from 'ws';
import Socket, { SocketState } from './socket';

export default class App {
  private readonly server: Server;
  private readonly sockets: Set<Socket>;

  constructor(port: number) {
    this.server = new Server({ port });
    this.sockets = new Set();
    this.mountEventListeners();
  }

  private mountEventListeners(): void {
    this.server.on('listening', () => {
      console.log('Server started!');
    });

    this.server.on('connection', ws => {
      const socket = new Socket(ws, this);
      this.sockets.add(socket);

      socket.sendWelcome();
    });
  }

  public onSocketEstablished(ws: Socket, packetId: number): void {
    for (const socket of this.sockets) {
      if (socket === ws) {
        socket.sendTicket(packetId);

        const users: ISyncUser[] = [];
        for (const socket of this.sockets) {
          if (socket.state === SocketState.PENDING) continue;
          if (socket === ws) continue;
          users.push({
            user_id: socket.userId!,
            nickname: socket.nickname,
            profile_image: socket.profileImage,
          });
        }
        socket.sendSyncUser(users);
      } else if (socket.state !== SocketState.PENDING) {
        socket.sendConnect(ws.userId!, ws.nickname, ws.profileImage);
      }
    }
  }

  public onSocketDisconnect(ws: Socket): void {
    this.sockets.delete(ws);
  }
}
