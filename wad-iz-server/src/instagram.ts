import EventEmitter from 'events';
import { IgApiClient, UserRepositorySearchResponseUsersItem } from 'instagram-private-api';
const targetIds = [
  // 'official_izone',
  // 'azzo_ssi',
  // 'chaeri_chaeso',
  // 'k.minjoo_official',
  '_yujin_an',
  'for_everyoung10',
  'hyemhyemu',
  'yena.jigumina',
  '75_yabuki',
  '39saku_chan',
  'chaestival_',
  '10_hitomi_06',
  'silver_rain.__',
  'lt2_watcher_01',
];

enum UserFeedStateItem {
  NONE = 'none',
  UNKNOWN = 'unknown',
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type UserFeedState = string | UserFeedStateItem;

export default class Instagram extends EventEmitter {
  private readonly client: IgApiClient;
  private readonly userMap: Map<
    UserRepositorySearchResponseUsersItem,
    [UserFeedState, UserFeedState]
  >;
  public watchUpdate: boolean = true;

  constructor() {
    super();
    this.client = new IgApiClient();
    this.userMap = new Map();
    if (process.env.NODE_ENV !== 'development')
      this.login()
        .then(() => this.loadUsers())
        .then(() => this.watch());
  }

  private async login(): Promise<void> {
    this.client.state.generateDevice(process.env.IG_USERNAME!);
    await this.client.account.login(process.env.IG_USERNAME!, process.env.IG_PASSWORD!);
    console.log('Instagram login');
  }

  private async loadUsers(): Promise<void> {
    for (const targetId of targetIds) {
      const user = await this.client.user.searchExact(targetId);
      this.userMap.set(user, [UserFeedStateItem.UNKNOWN, UserFeedStateItem.UNKNOWN]);
    }
  }

  private async watch(): Promise<void> {
    for (const user of this.userMap.keys()) {
      if (!this.watchUpdate) continue;

      await delay(7000 + Math.random() * 1000);

      const photoFeed = await this.client.feed.user(user.pk);
      const photoItems = await photoFeed.items();

      console.log(`Fetched ${user.username}`);

      if (photoItems.length === 0) {
        this.userMap.get(user)![0] === UserFeedStateItem.NONE;
        continue;
      }

      const lastPhotoId = this.userMap.get(user)![0];
      const targetPhoto = photoItems[0];

      if (lastPhotoId === UserFeedStateItem.UNKNOWN) {
        this.userMap.get(user)![0] = targetPhoto.id;
        continue;
      }

      if (lastPhotoId !== targetPhoto.id) {
        this.emit('photo-update', user.username, user.profile_pic_url);
        this.userMap.get(user)![0] = targetPhoto.id;
      }
    }
    this.watch();
  }
}
