import { Server } from 'ws';
import Socket, { SocketState } from './socket';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import Fund from './models/fund';

const wadizUrl = 'https://www.wadiz.kr/web/campaign/detail/111487';
const directAmount = 603173643;
const directLastUpdate = '05/07 17:00';

export default class App {
  private readonly server: Server;
  private readonly sockets: Set<Socket>;

  public amount: number | null = null;
  public supporter: number | null = null;
  public dailyUp: number | null = null;
  public dailyDown: number | null = null;

  constructor(port: number) {
    this.server = new Server({ port });
    this.sockets = new Set();
    this.mountEventListeners();
    this.mountWatchers();
  }

  private mountEventListeners(): void {
    this.server.on('listening', () => {
      console.log('Server started!');
    });

    this.server.on('connection', ws => {
      const socket = new Socket(ws, this);
      this.sockets.add(socket);

      socket.sendWelcome();
      socket.sendWadizSync();
      socket.sendDirectSync(directAmount, directLastUpdate);
      socket.sendDailySync();
    });
  }

  private mountWatchers(): void {
    const wadizWatcher = async () => {
      const response = await axios.get(wadizUrl);
      const document = new JSDOM(response.data).window.document;
      const amountElement = document.querySelector(
        '.wd-ui-sub-opener-info .total-amount > strong'
      )!;
      const supporterElement = document.querySelector(
        '.wd-ui-sub-opener-info .total-supporter > strong'
      )!;
      const amountText = amountElement.textContent!;
      const supporterText = supporterElement.textContent!;
      const amount = parseInt(amountText.replace(/,/g, '')) - directAmount;
      const supporter = parseInt(supporterText.replace(/,/g, ''));

      if (this.amount === null || this.supporter === null) {
        this.amount = amount;
        this.supporter = supporter;
        for (const socket of this.sockets) {
          socket.sendWadizSync();
        }
        return true;
      }

      if (amount !== this.amount || supporter !== this.supporter) {
        const amountDelta = amount - this.amount;
        const supporterDelta = supporter - this.supporter;
        for (const socket of this.sockets) {
          socket.sendWadizUpdate(amount, supporter, amountDelta, supporterDelta);
        }
        this.amount = amount;
        this.supporter = supporter;
      }
    };

    const dailyWatcher = async () => {
      const date = new Date();
      date.setDate(new Date().getDate() - 1);
      const fundList = await Fund.find({ time: { $gt: date } })
        .sort({ time: 1 })
        .exec();

      let up = 0;
      let down = 0;
      let lastAmount = fundList[0].amount;
      for (const item of fundList) {
        const delta = item.amount - lastAmount;
        if (delta === 0) continue;
        if (delta > 0) up += delta;
        if (delta < 0) down -= delta;
        lastAmount = item.amount;
      }

      if (this.dailyUp === null || this.dailyDown === null) {
        this.dailyUp = up;
        this.dailyDown = down;
        for (const socket of this.sockets) {
          socket.sendDailySync();
        }
        return true;
      }

      if (this.dailyUp !== up || this.dailyDown !== down) {
        for (const socket of this.sockets) {
          socket.sendDailyUpdate(up, down);
        }
        this.dailyDown = up;
        this.dailyDown = down;
      }
    };

    wadizWatcher();
    dailyWatcher();

    setInterval(wadizWatcher, 3000);
    setInterval(dailyWatcher, 5000);
  }

  public onSocketEstablished(ws: Socket, packetId: number): void {
    for (const socket of this.sockets) {
      if (socket === ws) {
        socket.sendTicket(packetId);

        const users: IUser[] = [];
        for (const socket of this.sockets) {
          if (socket.state === SocketState.PENDING) continue;
          if (socket === ws) continue;
          users.push({
            user_id: socket.userId!,
            nickname: socket.nickname,
            profile_image: socket.profileImage,
          });
        }
        socket.sendUserSync(users);
      } else if (socket.state !== SocketState.PENDING) {
        socket.sendConnect(ws.userId!, ws.nickname, ws.profileImage);
      }
    }
  }

  public onSocketDisconnect(ws: Socket): void {
    this.sockets.delete(ws);
  }
}
