import EventEmitter from 'events';
import { IgApiClient, UserRepositorySearchResponseUsersItem } from 'instagram-private-api';
const targetIds = [
  // 'official_izone',
  // 'azzo_ssi',
  // 'chaeri_chaeso',
  // '_yujin_an',
  // 'k.minjoo_official',
  'hyemhyemu',
  'yena.jigumina',
  '75_yabuki',
  '39saku_chan',
  'chaestival_',
  '10_hitomi_06',
  'silver_rain.__',
  '4ever_iz1',
];

enum UserFeedStateItem {
  NONE = 'none',
  UNKNOWN = 'unknown',
}

type UserFeedState = string | UserFeedStateItem;

export default class Instagram extends EventEmitter {
  private readonly client: IgApiClient;
  private readonly userMap: Map<
    UserRepositorySearchResponseUsersItem,
    [UserFeedState, UserFeedState]
  >;

  constructor() {
    super();
    this.client = new IgApiClient();
    this.userMap = new Map();
    if (process.env.NODE_ENV !== 'development' || true)
      this.login()
        .then(() => this.loadUsers())
        .then(() => {
          setInterval(() => this.watch(), 3000);
        });
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
      const photoFeed = await this.client.feed.user(user.pk);
      const photoItems = await photoFeed.items();
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

    for (const user of this.userMap.keys()) {
      const reelsFeed = await this.client.feed.reelsMedia({ userIds: [user.pk] });
      const reelsItems = await reelsFeed.items();
      if (reelsItems.length === 0) {
        this.userMap.get(user)![1] === UserFeedStateItem.NONE;
        continue;
      }

      const lastReelsId = this.userMap.get(user)![1];
      const targetReels = reelsItems[0];

      if (lastReelsId === UserFeedStateItem.UNKNOWN) {
        this.userMap.get(user)![1] = targetReels.id;
        continue;
      }

      if (lastReelsId !== targetReels.id) {
        this.emit('story-update', user.username, user.profile_pic_url);
        this.userMap.get(user)![1] = targetReels.id;
      }
    }
  }
}
