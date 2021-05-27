import EventEmitter from 'events';
import {
  IgApiClient,
  UserFeedResponseItemsItem,
  UserRepositoryInfoResponseUser,
} from 'instagram-private-api';
import { Log } from './log';

const targetUserIds = [
  // '48088489578', // Watcher
  '47636361181', // 권은비
  '3720950457', // 사쿠라
  '48034946360', // 강혜원
  '47698915733', // 최예나
  '47253291473', // 이채연
  '6938463993', // 나코
  '5753402370', // 히토미
  '6777351116', // 안유진
  '47598283663', // 장원영
];

const usernameMap = new Map<string, string>();
usernameMap.set('silver_rain.__', '권은비');
usernameMap.set('39saku_chan', '사쿠라');
usernameMap.set('hyemhyemu', '강혜원');
usernameMap.set('yena.jigumina', '최예나');
usernameMap.set('chaestival_', '이채연');
usernameMap.set('75_yabuki', '나코');
usernameMap.set('10_hitomi_06', '히토미');
usernameMap.set('_yujin_an', '안유진');
usernameMap.set('for_everyoung10', '장원영');

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Instagram extends EventEmitter {
  private readonly client: IgApiClient;
  public readonly userMap: Map<string, UserRepositoryInfoResponseUser>;
  public readonly photoMap: Map<string, UserFeedResponseItemsItem[]>;
  public watchUpdate: boolean = true;

  constructor() {
    super();
    this.client = new IgApiClient();
    this.userMap = new Map();
    this.photoMap = new Map();
    if (process.env.NODE_ENV !== 'development')
      this.login()
        .then(() => this.loadUsers())
        .then(() => this.watch());
  }

  private async login(): Promise<void> {
    this.client.state.generateDevice(process.env.IG_USERNAME!);
    await this.client.account.login(process.env.IG_USERNAME!, process.env.IG_PASSWORD!);
    Log.info('Instagram login');
  }

  private async loadUsers(): Promise<void> {
    for (const userId of targetUserIds) {
      const user = await this.client.user.info(userId);
      this.userMap.set(user.username, user);

      const userFeed = await this.client.feed.user(userId);
      const userFeedItems = await userFeed.items();
      this.photoMap.set(user.username, userFeedItems);
    }
    Log.info('Loaded user data');
  }

  private async watch(): Promise<void> {
    for (const user of this.userMap.values()) {
      await delay(7000 + Math.random() * 1000);
      if (!this.watchUpdate) continue;

      try {
        const userId = user.pk;
        const updatedUser = await this.client.user.info(userId);

        Log.info(`Fetched @${user.username}`);

        if (updatedUser.media_count !== user.media_count) {
          Log.info(`Updated @${user.username}`);
          this.emit('photo-update', user.username, updatedUser.profile_pic_url);
          this.userMap.set(user.username, updatedUser);

          const userFeed = await this.client.feed.user(userId);
          const userFeedItems = await userFeed.items();
          this.photoMap.set(user.username, userFeedItems);
        }
      } catch (e) {
        Log.error(e);
      }
    }

    this.watch();
  }

  public usernameToMemberName(username: string): string {
    return usernameMap.get(username) || '#';
  }
}
