import { Server } from 'ws';
import Socket, { SocketState } from './socket';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import Fund from './models/fund';

const wadizUrl = 'https://www.wadiz.kr/web/campaign/detail/111487';
const directAmount = 604737400;
const directLastUpdate = '05/17 17:00';

export interface ChatMessage {
  userId: string;
  role: number;
  nickname: string;
  profileImage: string;
  chat: Chat;
}

export default class App {
  private readonly server: Server;
  private readonly sockets: Set<Socket>;

  public amount: number | null = null;
  public supporter: number | null = null;
  public dailyUp: number | null = null;
  public dailyDown: number | null = null;
  public chartMeta: ChartMeta | null = null;

  public chatList: ChatMessage[] = [];
  public videoState: VideoState = { active: false };

  public weeklyItems: WeeklyItem[] = [];
  public historyItems: HistoryItem[] = [];

  public chartData: number[] = [];
  public chartDataTimestamp: number[] = [];

  constructor(port: number) {
    this.server = new Server({ port });
    this.sockets = new Set();
    this.mountEventListeners();
    this.mountWatchers();
    this.loadChartData();
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
      socket.sendChartMeta();
      socket.sendProfileImage();
      socket.sendEmoticonSync();
      if (this.weeklyItems.length !== 0) socket.sendWeeklySync(this.weeklyItems);
      if (this.historyItems.length !== 0) socket.sendHistorySync(this.historyItems);
      if (this.chartData.length !== 0) socket.sendChart();
    });
  }

  private mountWatchers(): void {
    const wadizWatcher = async () => {
      const response = await axios.get(wadizUrl, { validateStatus: () => true });
      if (response.status !== 200) {
        console.log(response.data);
      }
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
        this.updateWeeklySync();
        this.updateHistorySync();

        return true;
      }

      if (amount !== this.amount || supporter !== this.supporter) {
        const amountDelta = amount - this.amount;
        const supporterDelta = supporter - this.supporter;

        const wadizUpdateChat: Chat = { type: 'wadiz-update', delta: amountDelta };
        const timestamp = new Date().getTime();
        for (const socket of this.sockets) {
          socket.sendWadizUpdate(amount, supporter, amountDelta, supporterDelta, timestamp);
          socket.sendChat('#', '#', '#', wadizUpdateChat, 2);
        }

        this.chatList.push({
          userId: '#',
          role: 2,
          nickname: '#',
          profileImage: '#',
          chat: wadizUpdateChat,
        });
        if (this.chatList.length > 500) this.chatList.shift();

        this.amount = amount;
        this.supporter = supporter;

        this.chartData = [this.amount + directAmount, ...this.chartData];
        this.chartDataTimestamp = [timestamp, ...this.chartDataTimestamp];

        const fund = new Fund({ amount: this.amount + directAmount });
        if (process.env.NODE_ENV !== 'development') {
          fund.save().then(() => {
            this.updateWeeklySync();
            this.updateHistorySync();
          });
        } else {
          this.updateWeeklySync();
          this.updateHistorySync();
        }
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
      let upCount = 0;
      let downCount = 0;

      let highest: any, lowest: any;

      let lastAmount = fundList[0].amount;
      for (const item of fundList) {
        if (!highest || !lowest) {
          highest = item.amount;
          lowest = item.amount;
        }

        highest = Math.max(highest, item.amount);
        lowest = Math.min(lowest, item.amount);

        const delta = item.amount - lastAmount;

        if (delta === 0) continue;
        if (delta > 0) {
          up += delta;
          upCount++;
        }
        if (delta < 0) {
          down -= delta;
          downCount++;
        }

        lastAmount = item.amount;
      }

      this.chartMeta = {
        total: lastAmount,
        delta: up - down,
        delta_percent: ((up - down) / lastAmount) * 100,
        highest: highest,
        lowest: lowest,
        volume: upCount + downCount,
        order: upCount,
        cancel: downCount,
      };

      if (this.dailyUp === null || this.dailyDown === null) {
        this.dailyUp = up;
        this.dailyDown = down;
        for (const socket of this.sockets) {
          socket.sendDailySync();
          socket.sendChartMeta();
        }
        return true;
      }

      if (this.dailyUp !== up || this.dailyDown !== down) {
        for (const socket of this.sockets) {
          socket.sendDailyUpdate(up, down);
          socket.sendChartMeta();
        }
        this.dailyUp = up;
        this.dailyDown = down;
      }
    };

    wadizWatcher();
    dailyWatcher();

    setInterval(() => {
      wadizWatcher();
      dailyWatcher();
    }, 3000);
  }

  public async loadChartData(): Promise<void> {
    const amounts: number[] = [];
    const timestamps: number[] = [];
    const funds = await Fund.find().sort({ time: -1 }).limit(10000);
    for (const fund of funds) {
      amounts.push(fund.amount);
      timestamps.push(fund.time.getTime());
    }
    this.chartData = amounts;
    this.chartDataTimestamp = timestamps;
    for (const socket of this.sockets) {
      socket.sendChart();
    }
  }

  public getUserId(userId: string): null | Socket {
    for (const socket of this.sockets) {
      if (socket.userId === userId) return socket;
    }
    return null;
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
            nickname: socket.nickname!,
            profile_image: socket.profileImage!,
            role: socket.state - 1,
          });
        }

        socket.sendUserSync(users);
        socket.sendChatSync();
        socket.sendVideo();
      } else if (socket.state !== SocketState.PENDING) {
        socket.sendConnect(ws.userId!, ws.nickname!, ws.profileImage!);
      }
    }
  }

  public onSocketDisconnect(ws: Socket): void {
    this.sockets.delete(ws);
    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendDisconnect(ws.userId!);
    }
  }

  public onProfileUpdate(
    userId: string,
    nickname: string,
    profileImage: string,
    role: number
  ): void {
    this.chatList.forEach(chat => {
      if (chat.userId === userId) {
        chat.nickname = nickname;
        chat.profileImage = profileImage;
        chat.role = role;
      }
    });

    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendProfileUpdate(userId, nickname, profileImage, role);
    }
  }

  public onChatReceive(
    userId: string,
    nickname: string,
    profileImage: string,
    chat: Chat,
    role: number
  ): any {
    const chatTypes = ['text', 'emoticon'];
    if (!chatTypes.includes(chat.type)) {
      console.log('chat blocked : ' + chat.type);
      return false;
    }

    if (chat.type === 'text') {
      if (!chat.content || !chat.content.trim().length) return false;
      chat.content = chat.content.slice(0, 200);
    }

    this.chatList.push({ userId, nickname, profileImage, chat, role });
    if (this.chatList.length > 500) this.chatList.shift();

    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendChat(userId, nickname, profileImage, chat, role);
    }
  }

  public onVideoUpdate(): void {
    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendVideo();
    }
  }

  public onChatClear(): void {
    this.chatList = [];
    this.chatList.push({
      userId: '#',
      role: 2,
      nickname: '#',
      profileImage: '#',
      chat: { type: 'chat-clear' },
    });
    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendChatClear();
      socket.sendChat('#', '#', '#', { type: 'chat-clear' }, 2);
    }
  }

  public onReload(): void {
    for (const socket of this.sockets) {
      socket.sendReload();
    }
  }

  public async updateWeeklySync(): Promise<void> {
    const result: WeeklyItem[] = [];
    const dayM = 86400000;

    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    today.setDate(today.getDate() + 1);
    today.setHours(-(new Date().getTimezoneOffset() / 60 + 9), 0, 0, 0);
    const todayM = today.getTime();

    for (let day = 0; day < 7; day++) {
      const targetDay = new Date(todayM - dayM * day);
      const lastFund = (
        await Fund.find({ time: { $lt: targetDay } })
          .sort({ time: -1 })
          .limit(1)
      )[0];
      result.push({
        day: targetDay.getDay(),
        amount: lastFund.amount,
        isToday: day === 0,
      });
    }
    for (const socket of this.sockets) {
      socket.sendWeeklySync(result);
    }
    this.weeklyItems = result;
  }

  public async updateHistorySync(): Promise<void> {
    const funds = await Fund.find().sort({ time: -1 }).limit(100);
    const result: HistoryItem[] = [];
    let lastAmount = funds[0].amount;
    let lastTime = funds[0].time;
    for (const fund of funds.slice(1)) {
      const delta = lastAmount - fund.amount;
      if (!delta) {
        lastAmount = fund.amount;
        lastTime = fund.time;
        continue;
      }
      result.push({ delta, time: lastTime.getTime() });
      lastAmount = fund.amount;
      lastTime = fund.time;
      if (result.length === 5) break;
    }
    for (const socket of this.sockets) {
      socket.sendHistorySync(result);
    }
    this.historyItems = result;
  }
}
