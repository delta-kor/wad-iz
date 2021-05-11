import { AnimateSharedLayout, motion } from 'framer-motion';
import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';
import ChatInputer from './components/bar/ChatInputer';
import ChatTop from './components/bar/ChatTop';
import Navigator from './components/bar/Navigator';
import NavigatorPc from './components/bar/NavigatorPc';
import DayCard from './components/card/Day';
import MoneyCard from './components/card/Money';
import SurveyCard from './components/card/Survey';
import TotalCard from './components/card/Total';
import WeeklyCard from './components/card/Weekly';
import ChatWrapper from './components/chat/ChatWrapper';
import Youtube from './components/chat/Youtube';
import Copyright from './components/Copyright';
import Cover from './components/Cover';
import Profile from './components/Profile';
import { Color } from './styles/color';
import playSfx from './utils/sfx';
import Socket from './utils/socket';
import { Transform } from './utils/transform';

const CardStack = styled.div`
  display: grid;
  margin: -94px 0 0 0;
  padding: 0 36px 132px 36px;
  row-gap: 24px;
`;

const PcCardStackLeft = styled(motion.div)`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: calc(50% - 342px / 2 - 281px);
  width: 342px;
  flex-direction: column;
  justify-content: center;
  gap: 32px 0;
`;

const PcCardStackCenter = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: calc(50% - 342px / 2 + 93px);
  width: 342px;
  flex-direction: column;
  justify-content: center;
  gap: 32px 0;
`;

const PcCardStackRight = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: calc(50% - 342px / 2 + 467px);
  width: 342px;
  flex-direction: column;
  justify-content: center;
  gap: 32px 0;
`;

const ProfileWrapper = styled(motion.div)`
  position: absolute;
  height: 276px;
  left: 0px;
  right: 0px;
  top: calc(50% - 276px / 2);
`;

const PcProfileWrapper = styled(motion.div)`
  position: absolute;
  width: 414px;
  height: 276px;
  left: calc(50% - 414px / 2 + 118px);
  top: calc(50% - 276px / 2);
`;

const PcChatWrapper = styled(motion.div)<any>`
  position: fixed;
  left: ${({ isVideo }) => (isVideo ? 'calc(100% - 414px)' : '480px')};
  right: 0;
  top: 0;
  bottom: 0;
`;

const PcChatPanel = styled(motion.div)`
  position: absolute;
  width: 480px;
  left: 0px;
  top: 0px;
  bottom: 0;
  background: ${Color.WHITE};
`;

const PcChatCardStack = styled(motion.div)`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: 69px;
  width: 342px;
  flex-direction: column;
  justify-content: center;
  gap: 32px 0;
`;

interface User {
  userId: string;
  role: number;
  nickname: string;
  profileImage: string;
}

export interface ChatMessage {
  userId: string;
  role: number;
  nickname: string;
  profileImageUrl: string;
  chat: Chat;
}

interface State {
  menu: number;
  isVideo: boolean;
  videoState: VideoState;

  directAmount: number;
  directLastUpdate: string;
  wadizAmount: number;
  wadizSupporter: number;
  dailyUp: number;
  dailyDown: number;

  userId: string;
  users: User[];
  chats: ChatMessage[];
  emoticons: Map<string, string>;

  timeDelta: number;

  weeklyItems: WeeklyItem[];
}

const falloutProfileImage = 'http://lt2.kr/image/logo.iz.1.png';

export default class App extends Component<any, State> {
  private socket!: Socket;
  public profileImageMap: Map<string, string> = new Map();

  constructor(props: any) {
    super(props);
    this.state = {
      menu: 0,
      isVideo: false,
      videoState: { active: false },

      directAmount: 0,
      directLastUpdate: '',
      wadizAmount: 0,
      wadizSupporter: 0,
      dailyUp: 1,
      dailyDown: 1,
      userId: '',
      users: [],
      chats: [],
      emoticons: new Map(),

      timeDelta: 0,
      weeklyItems: [],
    };
  }

  componentDidMount() {
    this.socket = new Socket();

    this.socket.on('#server-close', () => {
      const chats = this.state.chats;
      chats.push({
        userId: '#',
        role: 2,
        nickname: '#',
        profileImageUrl: '#',
        chat: {
          type: 'feed',
          content: '서버와 연결이 끊겼습니다. 다시 연결하는 중...',
        },
      });
      this.setState({ chats });
      setTimeout(() => window.location.reload(), 10000);
    });

    this.socket.on('multiple-connect', () => {
      const chats = this.state.chats;
      chats.push({
        userId: '#',
        role: 2,
        nickname: '#',
        profileImageUrl: '#',
        chat: {
          type: 'feed',
          content: '다른 기기에서 접속하여 연결을 끊었습니다.',
        },
      });
      this.setState({ chats });
    });

    this.socket.on('welcome', (packet: WelcomeServerPacket) => {
      this.setState({ timeDelta: new Date().getTime() - packet.server_time });
    });

    this.socket.on('ticket', (packet: TicketServerPacket) => {
      this.setState({ userId: packet.user_id });
      const users = this.state.users;
      users.push({
        userId: packet.user_id,
        role: packet.role,
        nickname: packet.nickname,
        profileImage: packet.profile_image,
      });
      this.setState({ users });
    });

    this.socket.on('connect', (packet: ConnectServerPacket) => {
      const users = this.state.users.filter(user => user.userId !== packet.user_id);
      users.push({
        userId: packet.user_id,
        role: packet.role,
        nickname: packet.nickname,
        profileImage: packet.profile_image,
      });
      this.setState({ users });
    });
    this.socket.on('disconnect', (packet: DisconnectServerPacket) => {
      const users = this.state.users.filter(user => user.userId !== packet.user_id);
      this.setState({ users });
    });
    this.socket.on('user-sync', (packet: UserSyncServerPacket) => {
      const users = this.state.users;
      for (const user of packet.users) {
        users.push({
          userId: user.user_id,
          role: user.role,
          nickname: user.nickname,
          profileImage: user.profile_image,
        });
      }
      this.setState({ users });
    });

    this.socket.on('token', (packet: TokenServerPacket) => {
      localStorage.setItem('token', packet.token);
    });
    this.socket.on('direct-sync', (packet: DirectSyncServerPacket) => {
      this.setState({ directAmount: packet.amount, directLastUpdate: packet.last_update });
    });
    this.socket.on('wadiz-sync', (packet: WadizSyncServerPacket) => {
      this.setState({ wadizAmount: packet.amount, wadizSupporter: packet.supporter });
    });
    this.socket.on('wadiz-update', (packet: WadizUpdateServerPacket) => {
      if (packet.amount_delta > 0) {
        if (packet.amount_delta > 10000) {
          playSfx('fund_big');
        } else {
          playSfx('fund_small');
        }
      } else if (packet.amount_delta === 0) {
        playSfx('fund_zero');
      } else {
        playSfx('fund_minus');
      }
      this.setState({ wadizAmount: packet.amount, wadizSupporter: packet.supporter });
    });
    this.socket.on('daily-sync', (packet: DailySyncServerPacket) => {
      this.setState({ dailyUp: packet.up, dailyDown: packet.down });
    });
    this.socket.on('daily-update', (packet: DailyUpdateServerPacket) => {
      this.setState({ dailyUp: packet.up, dailyDown: packet.down });
    });
    this.socket.on('weekly-sync', (packet: WeeklySyncServerPacket) => {
      this.setState({ weeklyItems: packet.items });
    });

    this.socket.on('profile-image', (packet: ProfileImageServerPacket) => {
      for (const image of packet.images) {
        this.profileImageMap.set(image.key, image.url);
      }
    });

    this.socket.on('profile-update', (packet: ProfileUpdateServerPacket) => {
      if (this.state.userId === packet.user_id) {
        this.socket.nickname = packet.nickname;
        this.socket.profileImage = packet.profile_image;
      }
      const users = this.state.users.filter(user => user.userId !== packet.user_id);
      users.push({
        userId: packet.user_id,
        role: packet.role,
        nickname: packet.nickname,
        profileImage: packet.profile_image,
      });
      this.setState({ users });

      const chats = this.state.chats;
      chats.forEach(chat => {
        if (chat.userId === packet.user_id) {
          chat.role = packet.role;
          chat.nickname = packet.nickname;
          chat.profileImageUrl =
            this.profileImageMap.get(packet.profile_image) || falloutProfileImage;
        }
      });
      this.setState({ chats });
    });

    this.socket.on('chat', (packet: ChatServerPacket) => {
      const chats = this.state.chats;
      chats.push({
        userId: packet.user_id,
        role: packet.role,
        nickname: packet.nickname,
        profileImageUrl: this.profileImageMap.get(packet.profile_image) || falloutProfileImage,
        chat: packet.chat,
      });
      this.setState({ chats });
    });

    this.socket.on('chat-sync', (packet: ChatSyncServerPacket) => {
      const chats = this.state.chats;
      for (const chat of packet.chats) {
        chats.push({
          userId: chat.user_id,
          role: chat.role,
          nickname: chat.nickname,
          profileImageUrl: this.profileImageMap.get(chat.profile_image) || falloutProfileImage,
          chat: chat.chat,
        });
      }
      this.setState({ chats });
    });

    this.socket.on('chat-clear', (packet: ChatClearServerPacket) => {
      playSfx('chat_clear');
      this.setState({ chats: [] });
    });

    this.socket.on('emoticon-sync', (packet: EmoticonSyncServerPacket) => {
      const emoticons = this.state.emoticons;
      for (const emoticon of packet.emoticons) {
        emoticons.set(emoticon.key, emoticon.url);
      }
      this.setState({ emoticons });
    });

    this.socket.on('video', (packet: VideoServerPacket) => {
      if (packet.operation === 'stop') {
        this.setState({ isVideo: false, videoState: { active: false } });
      }
      if (packet.operation === 'play') {
        const videoState: VideoState = {
          active: true,
          service: packet.service,
          id: packet.id,
          isLive: packet.is_live,
          time: packet.time,
        };
        this.setState({ isVideo: true, videoState });
      }
    });

    this.socket.on('reload', (packet: ReloadServerPacket) => {
      window.location.reload();
    });
  }

  getMyProfile = (): User => {
    for (const user of this.state.users) {
      if (user.userId === this.state.userId) return user;
    }
    return { userId: this.state.userId, nickname: '', profileImage: '', role: 0 };
  };

  onNavigatorClick = (index: number) => {
    playSfx('navigator');
    this.setState({ menu: index });
  };

  onProfileInteract = (type: 'left' | 'right' | 'nickname') => {
    playSfx('swipe');
    if (type === 'nickname') {
      const nickname = prompt('닉네임을 입력하세요');
      if (!nickname || !nickname.trim().length) {
        return false;
      }
      if (nickname.length > 12) {
        alert('닉네임은 12자 이내여야 합니다');
        return false;
      }
      this.socket.updateProfile(nickname, this.socket.profileImage!);
    }
    if (type === 'right') {
      let index = Array.from(this.profileImageMap.keys()).indexOf(this.socket.profileImage!) + 1;
      if (index >= this.profileImageMap.size) {
        index = 0;
      }
      this.socket.updateProfile(
        this.socket.nickname!,
        Array.from(this.profileImageMap.keys())[index]
      );
    }
    if (type === 'left') {
      let index = Array.from(this.profileImageMap.keys()).indexOf(this.socket.profileImage!) - 1;
      if (index < 0) {
        index = this.profileImageMap.size - 1;
      }
      this.socket.updateProfile(
        this.socket.nickname!,
        Array.from(this.profileImageMap.keys())[index]
      );
    }
  };

  onChatSend = (text: string) => {
    playSfx('chat_send');
    if (this.state.emoticons.has(text)) {
      this.socket.sendEmoticonChat(text);
    } else {
      this.socket.sendTextChat(text);
    }
  };

  render() {
    const directCard = (
      <MoneyCard
        title={'직영'}
        label={this.state.directLastUpdate}
        amount={this.state.directAmount}
        noShadow={this.state.menu === 1}
        delay={0.1}
      />
    );
    const wadizCard = (
      <MoneyCard
        title={'wadiz'}
        label={Transform.toSupporterText(this.state.wadizSupporter)}
        amount={this.state.wadizAmount}
        noShadow={this.state.menu === 1}
        delay={0.2}
      />
    );
    const dayCard = (
      <DayCard
        total={this.state.dailyUp - this.state.dailyDown}
        up={this.state.dailyUp}
        down={this.state.dailyDown}
        delay={0.3}
      />
    );
    const surveyCard = (
      <SurveyCard
        totalAmount={3341459287}
        totalSupporter={9846}
        kwizAmount={this.state.directAmount + this.state.wadizAmount}
        kwizSupporter={this.state.wadizSupporter}
        delay={0.4}
      />
    );
    const weeklyCard = <WeeklyCard items={this.state.weeklyItems} delay={0.5} />;

    let content, pcContent;
    if (this.state.menu === 0) {
      content = (
        <div>
          <Cover amount={this.state.directAmount + this.state.wadizAmount}></Cover>
          <CardStack>
            {directCard}
            {wadizCard}
            {dayCard}
            {surveyCard}
            {weeklyCard}
            <Copyright isPc={false} />
          </CardStack>
        </div>
      );
      pcContent = (
        <div>
          <PcCardStackLeft layoutId={'card-stack'}>
            <TotalCard amount={this.state.directAmount + this.state.wadizAmount} />
            {directCard}
            {wadizCard}
          </PcCardStackLeft>
          <PcCardStackCenter>
            {dayCard}
            {surveyCard}
          </PcCardStackCenter>
          <PcCardStackRight>{weeklyCard}</PcCardStackRight>
          <Copyright isPc={true} />
        </div>
      );
    } else if (this.state.menu === 1) {
      content = (
        <div>
          <ChatTop
            title={Transform.toCurrency(this.state.directAmount + this.state.wadizAmount)}
            viewers={this.state.users.length}
            onBack={() => this.onNavigatorClick(0)}
          />
          <ChatWrapper
            isPc={false}
            isVideo={this.state.isVideo}
            messages={this.state.chats}
            userId={this.state.userId}
            emoticons={this.state.emoticons}
          />
          {this.state.isVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Youtube
                isPc={false}
                videoState={this.state.videoState}
                timeDelta={this.state.timeDelta}
              />
            </motion.div>
          )}
          <ChatInputer onTextSend={this.onChatSend} isPc={false} emoticons={this.state.emoticons} />
        </div>
      );
      pcContent = (
        <div>
          <PcChatWrapper isVideo={this.state.isVideo}>
            <ChatTop
              title={Transform.toCurrency(this.state.directAmount + this.state.wadizAmount)}
              viewers={this.state.users.length}
              onBack={() => this.onNavigatorClick(0)}
            />
            <ChatWrapper
              isPc={true}
              isVideo={this.state.isVideo}
              messages={this.state.chats}
              userId={this.state.userId}
              emoticons={this.state.emoticons}
            />
            <ChatInputer
              onTextSend={this.onChatSend}
              isPc={true}
              isVideo={this.state.isVideo}
              emoticons={this.state.emoticons}
            />
          </PcChatWrapper>
          {this.state.isVideo ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Youtube
                isPc={true}
                videoState={this.state.videoState}
                timeDelta={this.state.timeDelta}
              />
            </motion.div>
          ) : (
            <PcChatPanel layoutId={'navigator'}>
              <PcChatCardStack layoutId={'card-stack'}>
                <TotalCard amount={this.state.directAmount + this.state.wadizAmount} />
                {directCard}
                {wadizCard}
              </PcChatCardStack>
            </PcChatPanel>
          )}
        </div>
      );
    } else if (this.state.menu === 2) {
      const profile = this.getMyProfile();
      content = (
        <ProfileWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Profile
            nickname={profile.nickname}
            profileImageUrl={this.profileImageMap.get(profile.profileImage) || falloutProfileImage}
            onInteract={this.onProfileInteract}
          />
        </ProfileWrapper>
      );
      pcContent = (
        <PcProfileWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Copyright isPc={true} />
          <Profile
            nickname={profile.nickname}
            profileImageUrl={this.profileImageMap.get(profile.profileImage) || falloutProfileImage}
            onInteract={this.onProfileInteract}
          />
        </PcProfileWrapper>
      );
    }

    return (
      <AnimateSharedLayout>
        <MediaQuery maxWidth={1024}>
          <Navigator
            onClick={this.onNavigatorClick}
            active={this.state.menu}
            display={this.state.menu !== 1}
          />
          {content}
        </MediaQuery>
        <MediaQuery minWidth={1024}>
          {this.state.menu !== 1 && (
            <NavigatorPc onClick={this.onNavigatorClick} active={this.state.menu} />
          )}
          {pcContent}
        </MediaQuery>
      </AnimateSharedLayout>
    );
  }
}
