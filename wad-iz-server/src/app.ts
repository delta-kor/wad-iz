import { Server } from 'ws';
import Socket from './socket';

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

  public onSocketEstablished(ws: Socket): void {
    for (const socket of this.sockets) {
      if (socket === ws) continue;
      socket.sendConnect(ws.userId!, ws.nickname, ws.profileImage);
    }
  }

  public onSocketDisconnect(ws: Socket): void {
    this.sockets.delete(ws);
  }
}
