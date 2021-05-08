import { Server } from 'ws';

export default class App {
  public readonly server: Server;

  constructor(port: number) {
    this.server = new Server({ port });
    this.mountEventListeners();
  }

  private mountEventListeners() {
    this.server.on('listening', () => {
      console.log('Server started!');
    });
  }
}
