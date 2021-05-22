import axios from 'axios';
import jwt from 'jsonwebtoken';
import Env from './models/env';

interface VimeoVideoDataResponse {
  files: VimeoVideoData[];
}

interface VimeoVideoData {
  link: string;
  size: number;
}

export default class Vimeo {
  private webToken: string | null;

  constructor() {
    this.webToken = null;
    this.updateWebToken();
  }

  private async updateWebToken(): Promise<void> {
    if (!this.webToken) {
      const token = await this.fetchWebToken();
      this.webToken = token;
    } else {
      const decodedWebToken = jwt.decode(this.webToken) as any;
      const webTokenExp = decodedWebToken.exp * 1000 - 3 * 60 * 1000;
      const currentTime = new Date().getTime();
      if (currentTime > webTokenExp) {
        const token = await this.fetchWebToken();
        this.webToken = token;
      }
    }
  }

  private async fetchWebToken(): Promise<string> {
    const env = await Env.getEnv<any>('jwt');
    return env.value;
  }

  private async getVideoDatas(id: string): Promise<VimeoVideoData[]> {
    await this.updateWebToken();
    const response = await axios.get<VimeoVideoDataResponse>(
      `https://api.vimeo.com/videos/${id}?fields=files.size,files.link`,
      {
        headers: { Authorization: `jwt ${this.webToken}` },
      }
    );
    return response.data.files;
  }

  private getLargestVideoUrl(videoData: VimeoVideoData[]): string {
    const videos = [];
    for (const video of videoData) {
      if (video.link.includes('hls?')) continue;
      videos.push(video);
    }

    const largestVideoData = videos.reduce((prev, current) =>
      prev.size > current.size ? prev : current
    );
    return largestVideoData.link;
  }

  public async getVideoUrl(id: string): Promise<string | false> {
    try {
      const videoDatas = await this.getVideoDatas(id);
      const largestVideoUrl = this.getLargestVideoUrl(videoDatas);
      return largestVideoUrl;
    } catch (e) {
      return false;
    }
  }
}
