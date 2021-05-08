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
      const socket = new Socket(ws);
      socket.sendWelcome();
    });
  }
}
