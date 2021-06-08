import { Server } from 'ws';
import Socket, { SocketState } from './socket';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import Fund from './models/fund';
import Vimeo from './vimeo';
import Env from './models/env';
import Instagram from './instagram';
import ChatModel from './models/chat';
import { ChatMessage } from './models/chat';
import { Log } from './log';
import MusicBase from './music';
import Tweet from './tweet';

const wadizUrl = 'https://www.wadiz.kr/web/campaign/detail/111487';

let directAmount: number, directLastUpdate: string;

export default class App {
  private server!: Server;
  public sockets!: Set<Socket>;

  public vimeo!: Vimeo;
  public instagram!: Instagram;
  public tweet!: Tweet;

  public amount: number | null = null;
  public supporter: number | null = null;

  public chatList: ChatMessage[] = [];
  public videoState: VideoState = { active: false };
  public radioState: RadioState = { active: false };

  public chartData: number[] = [];
  public chartDataTimestamp: number[] = [];

  constructor(port: number) {
    (async () => {
      await this.loadEnv();
      Log.info('Loaded env');

      await this.loadChat();
      Log.info('Loaded chat');

      this.server = new Server({ port });
      this.sockets = new Set();
      this.vimeo = new Vimeo();
      this.instagram = new Instagram();
      this.tweet = new Tweet();

      this.mountEventListeners();
      this.mountWatchers();
      this.loadChartData();
    })();
  }

  private async loadEnv(): Promise<void> {
    directAmount = (await Env.getEnv<number>('direct_amount')).value;
    directLastUpdate = (await Env.getEnv<string>('direct_last_update')).value;
  }

  private mountEventListeners(): void {
    this.server.on('listening', () => {
      Log.info('Server started');
      this.startRadio();
    });

    this.server.on('connection', ws => {
      const socket = new Socket(ws, this);
      this.sockets.add(socket);

      socket.sendWelcome();
      socket.sendWadizSync();
      socket.sendDirectSync(directAmount, directLastUpdate);
      socket.sendProfileImage();
      socket.sendEmoticonSync();
      if (this.chartData.length !== 0) socket.sendChart();
    });

    this.instagram.on('post-update', (username: string, profileImage: string) => {
      const chat: InstagramPostUpdateChat = {
        type: 'ig-photo-update',
        username,
        profile_image: profileImage,
        url: `https://instagram.com/${username}/`,
      };
      this.saveSystemChat(chat);
      for (const socket of this.sockets) {
        socket.sendChat('#', '#', '#', chat, 2);
      }
    });

    this.instagram.on('story-update', (username: string, profileImage: string) => {
      const chat: InstagramStoryUpdateChat = {
        type: 'ig-story-update',
        username,
        profile_image: profileImage,
        url: `https://instagram.com/${username}/`,
      };
      this.saveSystemChat(chat);
      for (const socket of this.sockets) {
        socket.sendChat('#', '#', '#', chat, 2);
      }
    });

    this.tweet.on('in', (name: string, rank: number) => {
      if (!Tweet.checkValid(name)) return false;
      const chat: TweetInChat = {
        type: 'tweet-in',
        name,
        rank,
      };
      this.saveSystemChat(chat);
      for (const socket of this.sockets) {
        socket.sendChat('#', '#', '#', chat, 2);
      }
    });

    this.tweet.on('out', (name: string) => {
      if (!Tweet.checkValid(name)) return false;
      const chat: TweetOutChat = {
        type: 'tweet-out',
        name,
      };
      this.saveSystemChat(chat);
      for (const socket of this.sockets) {
        socket.sendChat('#', '#', '#', chat, 2);
      }
    });

    this.tweet.on('update', (name: string, from: number, to: number) => {
      if (!Tweet.checkValid(name)) return false;
      const chat: TweetUpdateChat = {
        type: 'tweet-update',
        name,
        from,
        to,
      };
      this.saveSystemChat(chat);
      for (const socket of this.sockets) {
        socket.sendChat('#', '#', '#', chat, 2);
      }
    });
  }

  private mountWatchers(): void {
    const wadizWatcher = async () => {
      const response = await axios.get(wadizUrl, { validateStatus: () => true });
      if (response.status !== 200) {
        Log.warn(response.data);
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

        this.saveSystemChat(wadizUpdateChat);
        if (this.chatList.length > 500) this.chatList.shift();

        this.amount = amount;
        this.supporter = supporter;

        this.chartData = [this.amount + directAmount, ...this.chartData];
        this.chartDataTimestamp = [timestamp, ...this.chartDataTimestamp];

        if (process.env.NODE_ENV !== 'development')
          new Fund({ amount: this.amount + directAmount }).save();
      }
    };

    const radioVoteWatcher = () => {
      if (!this.radioState.active) return false;
      if (this.radioState.until < Date.now()) {
        this.electRadioVote();
      }
    };

    wadizWatcher();

    setInterval(() => {
      wadizWatcher();
    }, 3000);

    setInterval(() => {
      radioVoteWatcher();
    }, 250);
  }

  private async saveChat(
    userId: string,
    ip: string,
    role: number,
    nickname: string,
    profileImage: string,
    chat: Chat
  ): Promise<void> {
    this.chatList.push({
      userId,
      role,
      nickname,
      profileImage,
      chat,
    });
    ChatModel.add(userId, ip, role, nickname, profileImage, chat);
  }

  private async saveSystemChat(chat: Chat): Promise<void> {
    await this.saveChat('#', '#', 2, '#', '#', chat);
  }

  private async loadChat(): Promise<void> {
    const chats = await ChatModel.load();
    this.chatList = chats;
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

  public startRadio(): void {
    const music = MusicBase.pick();
    this.playRadio(music);
  }

  public stopRadio(): void {
    this.radioState = { active: false };
    this.onRadioUpdate();
  }

  private playRadio(music: Music): void {
    this.radioState = {
      active: true,
      music,
      vote: [],
      until: new Date().getTime() + music.length * 1000 + 2000,
      time: new Date().getTime(),
    };
    this.onRadioUpdate();
    this.startRadioVote();
  }

  private startRadioVote(): any {
    if (!this.radioState.active) return false;
    const candidates = MusicBase.pickMultiple(3, this.radioState.music.id);
    this.radioState.vote = candidates.map(candidate => ({
      music: MusicBase.simplify(candidate),
      voter: [],
    }));
    this.onRadioVoteUpdate();
  }

  private electRadioVote(): any {
    if (!this.radioState.active) return false;
    const voterLength = this.radioState.vote.map(vote => vote.voter.length);
    const maxVoter = Math.max.apply(null, voterLength);

    const elected: VoteItem[] = [];
    for (const vote of this.radioState.vote) {
      if (vote.voter.length === maxVoter) elected.push(vote);
    }

    const final = elected[Math.floor(Math.random() * elected.length)];
    for (const music of MusicBase.Musics.values()) {
      if (music.id === final.music.id) {
        this.playRadio(music);
      }
    }
    return false;
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
        socket.sendRadio();
        socket.sendRadioVote();
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
    ChatModel.updateProfile(userId, nickname, profileImage, role);

    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendProfileUpdate(userId, nickname, profileImage, role);
    }
  }

  public onChatReceive(
    userId: string,
    ip: string,
    nickname: string,
    profileImage: string,
    chat: Chat,
    role: number
  ): any {
    const chatTypes = ['text', 'emoticon'];
    if (!chatTypes.includes(chat.type)) {
      Log.warn('chat blocked : ' + chat.type);
      return false;
    }

    if (chat.type === 'text') {
      if (!chat.content || !chat.content.trim().length) return false;
      chat.content = chat.content.slice(0, 200);
    }

    this.saveChat(userId, ip, role, nickname, profileImage, chat);

    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendChat(userId, nickname, profileImage, chat, role);
    }
  }

  public onVideoUpdate(): void {
    if (this.radioState.active && this.videoState.active) {
      this.radioState = { active: false };
      this.onRadioUpdate();
    }
    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendVideo();
    }
  }

  public onRadioUpdate(): void {
    if (this.videoState.active && this.radioState.active) {
      this.videoState = { active: false };
      this.onVideoUpdate();
    }
    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendRadio();
    }
  }

  public onRadioVoteUpdate(): void {
    for (const socket of this.sockets) {
      if (socket.state === SocketState.PENDING) continue;
      socket.sendRadioVote();
    }
  }

  public updateRadioVote(id: string, userId: string): any {
    if (!this.radioState.active) return false;
    this.radioState.vote.forEach(vote => (vote.voter = vote.voter.filter(id => id !== userId)));

    const target = this.radioState.vote.find(value => value.music.id === id);
    if (!target) return false;
    target.voter.push(userId);

    this.onRadioVoteUpdate();
  }

  public onChatClear(): void {
    this.chatList = [];
    this.saveSystemChat({ type: 'chat-clear' });
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
}
