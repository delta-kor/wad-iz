import WebSocket from 'ws';

export default class Socket {
  private readonly ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
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
}
