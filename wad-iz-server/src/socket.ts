import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import App from './app';
import ProfileImage from './profile-image';
import Emoticon from './emoticon';
import MultiVideo from './multi-video';
import Env from './models/env';
import Lyrics from './lyrics';
import { Log } from './log';

export enum SocketState {
  PENDING,
  DEFAULT,
  STAFF,
  MASTER,
}

export default class Socket {
  public readonly ws: WebSocket;
  public readonly app: App;
  public state: SocketState;
  public ip: string | null;
  public userId: string | null;
  public nickname: string | null;
  public profileImage: string | null;

  constructor(ws: WebSocket, app: App) {
    this.ws = ws;
    this.app = app;
    this.state = SocketState.PENDING;
    this.ip = null;
    this.userId = null;
    this.nickname = null;
    this.profileImage = null;

    this.ws.addEventListener('close', () => this.app.onSocketDisconnect(this));
    this.ws.addEventListener('message', ({ data }) => {
      try {
        const json = JSON.parse(data);
        this.onPacket(json).catch(e => Log.error(e));
      } catch (e) {}
    });
  }

  private async onPacket(packet: ClientPacket): Promise<any> {
    if (packet.type === 'ticket') {
      const sectors = packet.ticket.split('.');
      const data = sectors.slice(0, 2).join('.');
      const clientHash = sectors[2];
      const serverHash = crypto
        .createHash('sha256')
        .update(data + process.env.SECRET)
        .digest('base64');
      if (clientHash !== serverHash) return false;

      const ip = Buffer.from(sectors[0], 'base64').toString('utf-8');
      this.ip = ip;

      if (packet.token) {
        jwt.verify(packet.token, process.env.SECRET!, (err, decoded: any) => {
          if (err) throw new Error();
          const connectedUser = this.app.getUserId(decoded.user_id);
          if (connectedUser) {
            connectedUser.closeForMultipleConnect();
          }
          if (!decoded.role) decoded.role = 0;
          this.userId = decoded.user_id || null;
          this.nickname = decoded.nickname || null;
          this.profileImage = decoded.profile_image || null;
          this.state = decoded.role + 1;
        });
      } else {
        const userId = crypto.randomBytes(8).toString('hex');
        const nickname = `WIZ-${Math.round(Math.random() * 10000)
          .toString()
          .padStart(4, '0')}`;
        const profileImage = 'logo.iz.1';
        this.userId = userId;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.state = SocketState.DEFAULT;
        const token = jwt.sign(
          {
            user_id: this.userId,
            nickname: this.nickname,
            profile_image: this.profileImage,
            role: this.state - 1,
          },
          process.env.SECRET!
        );
        this.sendToken(token);
      }

      this.app.onSocketEstablished(this, packet.packet_id);
    }

    if (packet.type === 'profile-update') {
      const nickname = packet.nickname;
      const profileImage = packet.profile_image;

      if (nickname.length > 12) return false;
      if (profileImage.length > 50) return false;

      this.nickname = nickname;
      this.profileImage = profileImage;

      const role = this.state - 1;

      this.app.onProfileUpdate(this.userId!, this.nickname, this.profileImage, role);

      const token = jwt.sign(
        { user_id: this.userId, nickname: this.nickname, profile_image: this.profileImage, role },
        process.env.SECRET!
      );
      this.sendToken(token);
    }

    if (packet.type === 'chat') {
      if (this.state === SocketState.PENDING) return false;

      if (packet.chat.type === 'text') {
        const message = packet.chat.content;
        if (message.split(' ')[0] === '/인증') {
          const key = message.split(' ')[1];
          if (key === process.env.STAFF_KEY) {
            this.sendSystemMessage('관리자 인증 완료');

            this.state = SocketState.STAFF;
            this.app.onProfileUpdate(
              this.userId!,
              this.nickname!,
              this.profileImage!,
              this.state - 1
            );

            const token = jwt.sign(
              {
                user_id: this.userId,
                nickname: this.nickname,
                profile_image: this.profileImage,
                role: this.state - 1,
              },
              process.env.SECRET!
            );
            this.sendToken(token);
          } else if (key === process.env.MASTER_KEY) {
            this.sendSystemMessage('마스터 인증 완료');

            this.state = SocketState.MASTER;
            this.app.onProfileUpdate(
              this.userId!,
              this.nickname!,
              this.profileImage!,
              this.state - 1
            );

            const token = jwt.sign(
              {
                user_id: this.userId,
                nickname: this.nickname,
                profile_image: this.profileImage,
                role: this.state - 1,
              },
              process.env.SECRET!
            );
            this.sendToken(token);
          } else {
            this.sendSystemMessage('인증 실패');
          }
          return true;
        }
        if (message.split(' ')[0] === '/yt') {
          if (this.state < SocketState.STAFF) {
            this.sendSystemMessage('권한 부족');
            return false;
          }
          const operation = message.split(' ')[1];
          if (operation === 'stop') {
            this.app.videoState = { active: false };
            this.sendSystemMessage('유튜브 재생 중지');
            this.app.onVideoUpdate();
            return true;
          }
          if (operation === 'play') {
            const delta = parseInt(message.split(' ')[3]) || 0;
            this.app.videoState = {
              active: true,
              service: 'youtube',
              id: message.split(' ')[2],
              isLive: false,
              time: new Date().getTime() - delta * 1000,
            };
            this.sendSystemMessage('재생 시작');
            this.app.onVideoUpdate();
            return true;
          }
          if (operation === 'live') {
            this.app.videoState = {
              active: true,
              service: 'youtube',
              id: message.split(' ')[2],
              isLive: true,
              time: new Date().getTime(),
            };
            this.sendSystemMessage('재생 시작');
            this.app.onVideoUpdate();
            return true;
          }
          if (operation === 'multi') {
            const concert = message.split(' ').slice(2).join(' ');
            const video = MultiVideo.find(v => v.concert === concert);
            if (!video) {
              this.sendSystemMessage('해당 콘서트가 없습니다');
              return false;
            }
            this.app.videoState = {
              active: true,
              service: 'youtube',
              isMulti: true,
              id: video.id,
              name: video.name,
              sync: video.sync,
              time: new Date().getTime(),
            };
            this.sendSystemMessage('재생 시작');
            this.app.onVideoUpdate();
            return true;
          }
          if (operation === 'replay') {
            this.app.videoState = {
              active: true,
              service: 'youtube',
              id: this.app.videoState.id,
              isLive: false,
              time: new Date().getTime(),
            };
            this.sendSystemMessage('재생 시작');
            this.app.onVideoUpdate();
            return true;
          }
          this.sendSystemMessage('stop / play / live / multi / replay 로 입력');
          return false;
        }

        if (message.split(' ')[0] === '/vm') {
          if (this.state < SocketState.STAFF) {
            this.sendSystemMessage('권한 부족');
            return false;
          }
          const operation = message.split(' ')[1];
          if (operation === 'stop') {
            this.app.videoState = { active: false };
            this.sendSystemMessage('재생 중지');
            this.app.onVideoUpdate();
            return true;
          }
          if (operation === 'play') {
            const delta = parseInt(message.split(' ')[3]) || 0;
            const url = await this.app.vimeo.getVideoUrl(message.split(' ')[2]);
            if (!url) {
              this.sendSystemMessage('오류 발생');
              return false;
            }

            this.app.videoState = {
              active: true,
              service: 'url',
              id: url,
              isLive: false,
              time: new Date().getTime() - delta * 1000,
              lyrics: Lyrics.get(message.split(' ')[2]),
            };
            this.sendSystemMessage('재생 시작');
            this.app.onVideoUpdate();
            return true;
          }
          this.sendSystemMessage('stop / play / replay 로 입력');
          return false;
        }

        if (message.split(' ')[0] === '/radio') {
          if (this.state < SocketState.STAFF) {
            this.sendSystemMessage('권한 부족');
            return false;
          }
          const operation = message.split(' ')[1];
          if (operation === 'start') {
            this.sendSystemMessage('라디오 재생');
            this.app.startRadio();
            return true;
          }
          this.sendSystemMessage('start / stop 로 입력');
          return false;
        }

        if (message.split(' ')[0] === '/env') {
          if (this.state < SocketState.MASTER) {
            this.sendSystemMessage('권한 부족');
            return false;
          }

          const key = message.split(' ')[1];
          const value = message.split(' ').slice(2).join(' ');
          if (key === 'igwatch') {
            if (value === 'true') this.app.instagram.watchUpdate = true;
            else this.app.instagram.watchUpdate = false;
            this.sendSystemMessage(this.app.instagram.watchUpdate ? 'ON' : 'OFF');
            return true;
          }

          Env.setEnv(key, value);
          this.sendSystemMessage('설정 완료');
          return true;
        }

        if (message.split(' ')[0] === '/packet') {
          if (this.state < SocketState.MASTER) {
            this.sendSystemMessage('권한 부족');
            return false;
          }
          const packet = JSON.parse(message.split(' ').slice(1).join(' '));
          for (const socket of this.app.sockets) {
            socket.sendJson(packet);
          }
          return true;
        }

        if (message === '/clear') {
          if (this.state < SocketState.STAFF) {
            this.sendSystemMessage('권한 부족');
            return false;
          }
          this.app.onChatClear();
          return true;
        }

        if (message === '/reload') {
          if (this.state < SocketState.MASTER) {
            this.sendSystemMessage('권한 부족');
            return false;
          }
          this.app.onReload();
          return true;
        }
      }

      this.app.onChatReceive(
        this.userId!,
        this.ip!,
        this.nickname!,
        this.profileImage!,
        packet.chat,
        this.state - 1
      );
    }

    if (packet.type === 'instagram-profile') {
      return this.sendInstagramProfile(packet.packet_id);
    }

    if (packet.type === 'instagram-post') {
      return this.sendInstagramPost(packet.username, packet.packet_id);
    }
  }

  private sendJson(json: any): void {
    this.ws.send(JSON.stringify(json));
  }

  private sendPacket(packet: ServerPacketBase): void {
    this.sendJson(packet);
  }

  public sendSystemMessage(message: string): void {
    this.sendChat(
      'system',
      'SYSTEM',
      'SYSTEM',
      {
        type: 'text',
        content: message,
      },
      2
    );
  }

  public sendWelcome(): void {
    const packet: WelcomeServerPacket = {
      type: 'welcome',
      packet_id: null,
      server_time: new Date().getTime(),
    };
    this.sendPacket(packet);
  }

  public sendToken(token: string): void {
    const packet: TokenServerPacket = {
      type: 'token',
      packet_id: null,
      token,
    };
    this.sendPacket(packet);
  }

  public sendTicket(packetId: number): void {
    const packet: TicketServerPacket = {
      type: 'ticket',
      packet_id: packetId,
      user_id: this.userId!,
      role: this.state - 1,
      nickname: this.nickname!,
      profile_image: this.profileImage!,
    };
    this.sendPacket(packet);
  }

  public closeForMultipleConnect(): void {
    const packet: MultipleConnectServerPacket = {
      type: 'multiple-connect',
      packet_id: null,
    };
    this.sendPacket(packet);
    this.state = SocketState.PENDING;
    this.userId = null;
  }

  public sendConnect(userId: string, nickname: string, profileImage: string): void {
    const packet: ConnectServerPacket = {
      type: 'connect',
      packet_id: null,
      user_id: userId,
      role: this.state - 1,
      nickname: nickname,
      profile_image: profileImage,
    };
    this.sendPacket(packet);
  }

  public sendDisconnect(userId: string): void {
    const packet: DisconnectServerPacket = {
      type: 'disconnect',
      packet_id: null,
      user_id: userId,
    };
    this.sendPacket(packet);
  }

  public sendUserSync(users: IUser[]): void {
    users = users.filter(user => user.user_id !== this.userId);
    const packet: UserSyncServerPacket = {
      type: 'user-sync',
      packet_id: null,
      users,
    };
    this.sendPacket(packet);
  }

  public sendWadizUpdate(
    amount: number,
    supporter: number,
    amountDelta: number,
    supporterDelta: number,
    timestamp: number
  ): void {
    const packet: WadizUpdateServerPacket = {
      type: 'wadiz-update',
      packet_id: null,
      amount,
      supporter,
      amount_delta: amountDelta,
      supporter_delta: supporterDelta,
      timestamp,
    };
    this.sendPacket(packet);
  }

  public sendWadizSync(): any {
    if (this.app.amount === null || this.app.supporter === null) return false;
    const packet: WadizSyncServerPacket = {
      type: 'wadiz-sync',
      packet_id: null,
      amount: this.app.amount,
      supporter: this.app.supporter,
    };
    this.sendPacket(packet);
  }

  public sendDirectSync(amount: number, lastUpdate: string): void {
    const packet: DirectSyncServerPacket = {
      type: 'direct-sync',
      packet_id: null,
      amount: amount,
      last_update: lastUpdate,
    };
    this.sendPacket(packet);
  }

  public sendProfileImage(): void {
    const images: IProfileImage[] = [];
    for (const top of Object.keys(ProfileImage)) {
      for (const middle of Object.keys(ProfileImage[top])) {
        const items = ProfileImage[top][middle];
        for (const item of items) {
          const key = `${top}.${middle}.${item}`;
          images.push({ key, url: `http://lt2.kr/image/${key}.png` });
        }
      }
    }
    const packet: ProfileImageServerPacket = {
      type: 'profile-image',
      packet_id: null,
      images,
    };
    this.sendPacket(packet);
  }

  public sendProfileUpdate(
    userId: string,
    nickname: string,
    profileImage: string,
    role: number
  ): void {
    const packet: ProfileUpdateServerPacket = {
      type: 'profile-update',
      packet_id: null,
      user_id: userId,
      role: role,
      nickname: nickname,
      profile_image: profileImage,
    };
    this.sendPacket(packet);
  }

  public sendChat(
    userId: string,
    nickname: string,
    profileImage: string,
    chat: Chat,
    role: number
  ): void {
    const packet: ChatServerPacket = {
      type: 'chat',
      packet_id: null,
      user_id: userId,
      role: role,
      nickname: nickname,
      profile_image: profileImage,
      chat: chat,
    };
    this.sendPacket(packet);
  }

  public sendChatSync(): void {
    const chats = [];
    for (const message of this.app.chatList) {
      chats.push({
        user_id: message.userId,
        role: message.role,
        nickname: message.nickname,
        profile_image: message.profileImage,
        chat: message.chat,
      });
    }
    const packet: ChatSyncServerPacket = {
      type: 'chat-sync',
      packet_id: null,
      chats,
    };
    this.sendPacket(packet);
  }

  public sendEmoticonSync(): void {
    const packet: EmoticonSyncServerPacket = {
      type: 'emoticon-sync',
      packet_id: null,
      emoticons: Emoticon,
    };
    this.sendPacket(packet);
  }

  public sendVideo(): void {
    const videoState = this.app.videoState;
    if (videoState.active) {
      let packet: MultiPlayVideoServerPacket | PlayVideoServerPacket;
      if (videoState.isMulti) {
        packet = {
          type: 'video',
          packet_id: null,
          operation: 'multi-play',
          service: videoState.service!,
          id: videoState.id as string[],
          name: videoState.name!,
          sync: videoState.sync!,
          time: videoState.time!,
        };
      } else {
        packet = {
          type: 'video',
          packet_id: null,
          operation: 'play',
          service: videoState.service!,
          id: videoState.id as string,
          is_live: videoState.isLive!,
          time: videoState.time!,
          lyrics: videoState.lyrics,
        };
      }
      this.sendPacket(packet);
    } else {
      const packet: StopVideoServerPacket = {
        type: 'video',
        packet_id: null,
        operation: 'stop',
      };
      this.sendPacket(packet);
    }
  }

  public sendRadio(): void {
    const radioState = this.app.radioState;
    if (radioState.active) {
      const packet: PlayRadioServerPacket = {
        type: 'radio',
        packet_id: null,
        operation: 'play',
        id: radioState.music.id,
        title: radioState.music.title,
        subtitle: radioState.music.subtitle,
        album_title: radioState.music.album.title,
        image_url: radioState.music.album.imageUrl,
        lyrics: radioState.music.lyrics,
        length: radioState.music.length,
      };
      this.sendPacket(packet);
    } else {
      const packet: StopRadioServerPacket = {
        type: 'radio',
        packet_id: null,
        operation: 'stop',
      };
      this.sendPacket(packet);
    }
  }

  public sendRadioVote(): any {
    const radioState = this.app.radioState;
    if (!radioState.active) return false;

    const packet: RadioVoteDataServerPacket = {
      type: 'vote',
      packet_id: null,
      operation: 'data',
      votes: radioState.vote,
      until: radioState.until,
    };
    this.sendPacket(packet);
  }

  public sendChatClear(): void {
    const packet: ChatClearServerPacket = {
      type: 'chat-clear',
      packet_id: null,
    };
    this.sendPacket(packet);
  }

  public sendReload(): void {
    const packet: ReloadServerPacket = {
      type: 'reload',
      packet_id: null,
    };
    this.sendPacket(packet);
  }

  public sendChart(): any {
    if (!this.app.chartData.length || !this.app.chartDataTimestamp.length) return false;
    const packet: ChartServerPacket = {
      type: 'chart',
      packet_id: null,
      data: this.app.chartData,
      timestamp: this.app.chartDataTimestamp,
    };
    this.sendPacket(packet);
  }

  public sendInstagramProfile(packetId: number): void {
    const profiles: InstagramProfile[] = [];
    const userMap = this.app.instagram.userMap;
    for (const user of userMap.values()) {
      profiles.push({
        username: user.username,
        profile_image: user.profile_pic_url,
        member_name: this.app.instagram.usernameToMemberName(user.username),
        followers: user.follower_count,
        posts: user.media_count,
        bio: user.biography,
      });
    }
    const packet: InstagramProfileServerPacket = {
      type: 'instagram-profile',
      packet_id: packetId,
      profiles,
    };
    this.sendPacket(packet);
  }

  public sendInstagramPost(username: string, packetId: number): void {
    const result: InstagramPost[] = [];
    const posts = this.app.instagram.postMap.get(username) || [];
    for (const post of posts) {
      const photos: string[] = [];
      let width: number = 0,
        height: number = 0;

      for (const photo of post.carousel_media || []) {
        photos.push(photo.image_versions2.candidates[0].url);
        if (!width || !height) {
          width = photo.original_width;
          height = photo.original_height;
        }
      }

      if (photos.length === 0) {
        photos.push(post.image_versions2.candidates[0].url);
        width = post.image_versions2.candidates[0].width;
        height = post.image_versions2.candidates[0].height;
      }

      result.push({
        photos,
        content: post.caption?.text,
        likes: post.like_count,
        timestamp: parseInt(post.device_timestamp as string),
        width,
        height,
      });
    }
    const packet: InstagramPostServerPacket = {
      type: 'instagram-post',
      packet_id: packetId,
      posts: result,
    };
    this.sendPacket(packet);
  }
}
