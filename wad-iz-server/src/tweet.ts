import Twitter from 'twitter';
import EventEmitter from 'events';
import utils from 'util';

interface TrendsItem {
  name: string;
  url: string;
  promoted_content: null;
  query: string;
  tweet_volume: null | number;
}

export default class Tweet extends EventEmitter {
  private readonly client: Twitter;
  private readonly rank: Map<string, number>;

  constructor() {
    super();
    this.client = new Twitter({
      consumer_key: process.env.T_CONSUMER_KEY!,
      consumer_secret: process.env.T_CONSUMER_SECRET!,
      access_token_key: process.env.T_ACCESS_TOKEN_KEY!,
      access_token_secret: process.env.T_ACCESS_TOKEN_SECRET!,
      bearer_token: process.env.T_BEARER_TOKEN,
    });
    this.rank = new Map();

    if (process.env.NODE_ENV !== 'development') setInterval(() => this.updateRank(), 12000);
  }

  private async updateRank(): Promise<any> {
    const trends = await this.getTrends();

    let index = 0;
    for (const trend of trends) {
      index++;

      if (!this.rank.has(trend.name)) {
        this.emit('in', trend.name, index);
        this.rank.set(trend.name, index);
        continue;
      }

      if (this.rank.get(trend.name) !== index) {
        if (this.rank.get(trend.name)! > index) {
          this.emit('update', trend.name, this.rank.get(trend.name), index);
          this.rank.set(trend.name, index);
        }
        continue;
      }
    }
  }

  private async getTrends(): Promise<TrendsItem[]> {
    return new Promise((resolve, reject) => {
      this.client.get('trends/place', { id: '23424868' }, (err, res) => {
        if (err) return reject(err);
        resolve(res[0].trends);
      });
    });
  }

  public static checkValid(name: string): boolean {
    const target = ['iz', 'IZ', '즈원', '예나', 'YENA', '채연', 'Chaeyeon'];
    for (const item of target) {
      if (name.includes(item)) return true;
    }
    return false;
  }
}
