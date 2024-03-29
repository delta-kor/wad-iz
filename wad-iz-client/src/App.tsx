import { AnimateSharedLayout, motion } from 'framer-motion';
import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';
import CardSelector from './components/bar/CardSelector';
import ChartHeading from './components/bar/ChartHeading';
import ChartTitle from './components/bar/ChartTitle';
import ChatInputer from './components/bar/ChatInputer';
import ChatTop from './components/bar/ChatTop';
import Navigator from './components/bar/Navigator';
import NavigatorPc from './components/bar/NavigatorPc';
import DayCard from './components/card/Day';
import HistoryCard from './components/card/History';
import MoneyCard from './components/card/Money';
import SurveyCard from './components/card/Survey';
import TotalCard from './components/card/Total';
import WeeklyCard from './components/card/Weekly';
import Chart from './components/Chart';
import ChatWrapper from './components/chat/ChatWrapper';
import Radio from './components/chat/Radio';
import RadioPc from './components/chat/RadioPc';
import RadioVote from './components/chat/RadioVote';
import Video from './components/chat/Video';
import Youtube from './components/chat/Youtube';
import Copyright from './components/Copyright';
import Cover from './components/Cover';
import InstagramDashboard from './components/dashboard/InstagramDashboard';
import TimelineDashboard from './components/dashboard/TimelineDashboard';
import Loading from './components/Loading';
import MultiVideoSelector from './components/MultiVideoSelector';
import MultiVideoSelectorPc from './components/MultiVideoSelectorPc';
import OutOfService from './components/OutOfService';
import Profile from './components/Profile';
import Statistics from './components/Statistics';
import { Color } from './styles/color';
import { parseCandleData } from './utils/candle';
import { getEmoticonUrlByKey } from './utils/emoticon';
import playSfx from './utils/sfx';
import Socket from './utils/socket';
import { Transform } from './utils/transform';

const CardStack = styled.div`
  display: grid;
  margin: -108px auto 0 auto;
  max-width: 580px;
  padding: 0 36px 132px 36px;
  row-gap: 24px;
`;

const PcCardStackLeft = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: calc(50% - 342px / 2 - 304px);
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
  left: calc(50% - 342px / 2 + 70px);
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
  left: calc(50% - 342px / 2 + 444px);
  width: 342px;
  flex-direction: column;
  justify-content: center;
  gap: 32px 0;
`;

const PcCardSelector = styled.div`
  position: absolute;
  top: 102px;
  left: 50%;
  transform: translateX(-50%);
  height: 56px;
`;

const PcInstagramWrapper = styled.div`
  position: absolute;
  left: calc(50% - 716px / 2);
  width: 716px;
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

const PcRadioWrapper = styled(motion.div)`
  position: absolute;
  left: 480px;
  right: 414px;
  top: 0;
  bottom: 0;
`;

const PcRadioVoteWrapper = styled(motion.div)`
  position: relative;
  padding: 0 32px;
`;

const PcChatWrapper = styled(motion.div)<any>`
  position: fixed;
  left: ${({ isVideo }) => (isVideo ? 'calc(100% - 414px)' : '480px')};
  right: 0;
  top: 0;
  bottom: 0;
`;

const PcChatPanel = styled(motion.div)<any>`
  position: absolute;
  width: ${({ isRadio }) => (isRadio ? 'unset' : '480px')};
  right: ${({ isRadio }) => (isRadio ? '414px' : 'unset')};
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

const ChartBackground = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${Color.WHITE};
`;

const ChartPcWrapper = styled.div`
  position: fixed;
  left: 64px;
  right: calc(328px + 64px + 32px);
  top: 272px;
  bottom: 64px;
`;

const StatisticsPcWrapper = styled.div`
  position: fixed;
  width: 328px;
  top: 272px;
  bottom: 64px;
  right: 64px;
`;

const ChartMobileText = styled.div`
  text-align: center;
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
  dashboardMenu: number;

  isVideo: boolean;
  isRadio: boolean;

  selectedVideo: number;

  videoState: VideoState;
  radioState: RadioState;

  directAmount: number;
  directLastUpdate: string;
  wadizAmount: number;
  wadizSupporter: number;

  userId: string;
  users: User[];
  chats: ChatMessage[];
  emoticons: EmoticonSet[];

  timeDelta: number;

  candleData: CandleData[];
}

const falloutProfileImage = 'http://lt2.kr/image/logo.iz.1.png';

export default class App extends Component<any, State> {
  private socket!: Socket;
  public profileImageMap: Map<string, string> = new Map();
  private reloadTimeout: any;

  constructor(props: any) {
    super(props);
    this.state = {
      menu: 4,
      dashboardMenu: 0,

      isVideo: false,
      isRadio: false,

      selectedVideo: 0,

      videoState: { active: false },
      radioState: { active: false },

      directAmount: 0,
      directLastUpdate: '',
      wadizAmount: 0,
      wadizSupporter: 0,

      userId: '',
      users: [],
      chats: [],
      emoticons: [],

      timeDelta: 0,

      candleData: [],
    };
  }

  componentDidMount() {
    this.socket = new Socket();
    this.mountSocketListeners();
  }

  mountSocketListeners = () => {
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
      this.reloadTimeout = setTimeout(() => window.location.reload(), 10000);
    });

    this.socket.on('#server-error', () => {
      clearTimeout(this.reloadTimeout);
      this.socket = new Socket();
      this.mountSocketListeners();
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
      this.setState({ menu: 5 });
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
        if (packet.amount_delta > 100000) {
          playSfx('fund_super_big');
        } else if (packet.amount_delta > 10000) {
          playSfx('fund_big');
        } else {
          playSfx('fund_small');
        }
      } else {
        playSfx('fund_minus');
      }
      const candles = this.state.candleData;
      const candle: CandleData = {
        from: candles[0].to,
        to: packet.amount + this.state.directAmount,
        delta: packet.amount_delta,
        timestamp: new Date(packet.timestamp),
      };
      this.setState({
        wadizAmount: packet.amount,
        wadizSupporter: packet.supporter,
        candleData: [candle, ...candles],
      });
    });
    this.socket.on('chart', (packet: ChartServerPacket) => {
      let data: CandleData[];
      if (packet.timestamp[0] > packet.timestamp.slice(-1)[0])
        data = parseCandleData(packet.data, packet.timestamp);
      else data = parseCandleData(packet.data.reverse(), packet.timestamp.reverse());
      this.setState({ candleData: data });
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
      if (packet.chat.type === 'ig-photo-update') {
        playSfx('instagram');
      }

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
        emoticons.push(emoticon);
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
          lyrics: packet.lyrics,
        };
        this.setState({ isVideo: true, videoState });
      }
      if (packet.operation === 'multi-play') {
        const videoState: VideoState = {
          active: true,
          service: packet.service,
          isMulti: true,
          id: packet.id,
          name: packet.name,
          sync: packet.sync,
          time: packet.time,
        };
        this.setState({ isVideo: true, selectedVideo: 0, videoState });
      }
    });

    this.socket.on('radio', (packet: RadioServerPacket) => {
      if (packet.operation === 'play') {
        let vote: VoteItem[] = [],
          until: number = 0;

        if (this.state.radioState.active) {
          vote = this.state.radioState.vote;
          until = this.state.radioState.until;
        }

        const radioState: RadioState = {
          active: true,
          music: {
            id: packet.id,
            title: packet.title,
            subtitle: packet.subtitle,
            album: {
              title: packet.album_title,
              imageUrl: packet.image_url,
            },
            lyrics: packet.lyrics,
            length: packet.length,
            isJapanese: packet.isJapanese,
          },
          time: packet.time,
          vote,
          until,
        };
        this.setState({ isRadio: true, radioState });
      }

      if (packet.operation === 'stop') {
        this.setState({ isRadio: false, radioState: { active: false } });
      }
    });

    this.socket.on('radio-vote', (packet: RadioVoteServerPacket) => {
      if (!this.state.radioState.active) return false;
      if (packet.operation === 'data') {
        const radioState = this.state.radioState;
        radioState.vote = packet.votes;
        radioState.until = packet.until;
        this.setState({ radioState });
        return true;
      }
      if (packet.operation === 'result') {
        const radioState = this.state.radioState;
        radioState.vote = [];
        radioState.until = 0;
        this.setState({ radioState });
        return true;
        // TODO : Vote result
      }
    });

    this.socket.on('reload', (packet: ReloadServerPacket) => {
      window.location.reload();
    });
  };

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
    if (getEmoticonUrlByKey(this.state.emoticons, text)) {
      this.socket.sendEmoticonChat(text);
    } else {
      this.socket.sendTextChat(text);
    }
  };

  onRadioVoteSelect = (id: string) => {
    this.socket.sendRadioVote(id);
  };

  render() {
    const totalCard = (
      <TotalCard
        amount={this.state.directAmount + this.state.wadizAmount}
        layoutId={'total-card'}
      />
    );
    const directCard = (
      <MoneyCard
        title={'직영'}
        label={this.state.directLastUpdate}
        amount={this.state.directAmount}
        noShadow={this.state.menu === 1}
        layoutId={'direct-card'}
      />
    );
    const wadizCard = (
      <MoneyCard
        title={'wadiz'}
        label={Transform.toSupporterText(this.state.wadizSupporter)}
        amount={this.state.wadizAmount}
        noShadow={this.state.menu === 1}
        layoutId={'wadiz-card'}
      />
    );
    const dayCard = <DayCard data={this.state.candleData} delay={0} />;
    const surveyCard = (
      <SurveyCard
        totalAmount={3341459287}
        totalSupporter={9846}
        directAmount={this.state.directAmount}
        wadizAmount={this.state.wadizAmount}
        supporter={this.state.wadizSupporter}
        delay={0.1}
      />
    );
    const weeklyCard = <WeeklyCard data={this.state.candleData} delay={0.2} />;
    const historyCard = (
      <HistoryCard
        items={this.state.candleData}
        delay={0.3}
        onChartClick={() => this.onNavigatorClick(3)}
        layoutId={'history-card'}
      />
    );

    let content, pcContent;
    if (this.state.menu === 0) {
      content = (
        <div>
          <Cover amount={this.state.directAmount + this.state.wadizAmount}></Cover>
          <CardStack>
            <CardSelector
              isPc={false}
              selected={this.state.dashboardMenu}
              onChange={menu => this.setState({ dashboardMenu: menu })}
            />
            {this.state.dashboardMenu === 0 && (
              <>
                {directCard}
                {wadizCard}
                {dayCard}
                {surveyCard}
                {weeklyCard}
                {historyCard}
              </>
            )}
            {this.state.dashboardMenu === 1 && (
              <InstagramDashboard socket={this.socket} isPc={false} />
            )}
            {this.state.dashboardMenu === 2 && (
              <TimelineDashboard socket={this.socket} isPc={false} />
            )}
            <Copyright isPc={false} />
          </CardStack>
        </div>
      );
      pcContent = (
        <>
          {this.state.dashboardMenu === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PcCardStackLeft>
                {totalCard}
                {directCard}
                {wadizCard}
              </PcCardStackLeft>
              <PcCardStackCenter>
                {dayCard}
                {surveyCard}
              </PcCardStackCenter>
              <PcCardStackRight>
                {weeklyCard}
                {historyCard}
              </PcCardStackRight>
              <Copyright isPc={true} />
            </motion.div>
          )}
          {this.state.dashboardMenu === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PcInstagramWrapper>
                <InstagramDashboard socket={this.socket} isPc={true} />
              </PcInstagramWrapper>
            </motion.div>
          )}
          {this.state.dashboardMenu === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PcInstagramWrapper>
                <TimelineDashboard socket={this.socket} isPc={true} />
              </PcInstagramWrapper>
            </motion.div>
          )}
          <PcCardSelector>
            <CardSelector
              isPc={true}
              selected={this.state.dashboardMenu}
              onChange={menu => this.setState({ dashboardMenu: menu })}
            />
          </PcCardSelector>
        </>
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
            isVideo={this.state.isVideo || this.state.isRadio}
            messages={this.state.chats}
            userId={this.state.userId}
            emoticons={this.state.emoticons}
          />
          {this.state.isVideo && this.state.videoState.service === 'youtube' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <MultiVideoSelector
                active={this.state.videoState.isMulti!}
                name={this.state.videoState.name!}
                selected={this.state.selectedVideo}
                onSelect={index => this.setState({ selectedVideo: index })}
              />
              <Youtube
                isPc={false}
                videoState={this.state.videoState}
                selectedVideo={this.state.selectedVideo}
                timeDelta={this.state.timeDelta}
              />
            </motion.div>
          )}
          {this.state.isVideo && this.state.videoState.service === 'url' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Video
                isPc={false}
                videoState={this.state.videoState}
                timeDelta={this.state.timeDelta}
              />
            </motion.div>
          )}
          {this.state.isRadio && this.state.radioState.active && (
            <Radio
              radio={this.state.radioState}
              timeDelta={this.state.timeDelta}
              userId={this.state.userId}
              onSelect={this.onRadioVoteSelect}
            />
          )}
          <ChatInputer onTextSend={this.onChatSend} isPc={false} emoticons={this.state.emoticons} />
        </div>
      );
      pcContent = (
        <div>
          <PcChatWrapper isVideo={this.state.isVideo || this.state.isRadio}>
            <ChatTop
              title={Transform.toCurrency(this.state.directAmount + this.state.wadizAmount)}
              viewers={this.state.users.length}
              onBack={() => this.onNavigatorClick(0)}
              isPc={true}
            />
            <ChatWrapper
              isPc={true}
              isVideo={this.state.isVideo || this.state.isRadio}
              messages={this.state.chats}
              userId={this.state.userId}
              emoticons={this.state.emoticons}
            />
            <ChatInputer
              onTextSend={this.onChatSend}
              isPc={true}
              isVideo={this.state.isVideo || this.state.isRadio}
              emoticons={this.state.emoticons}
            />
          </PcChatWrapper>
          {this.state.isVideo ? (
            this.state.videoState.service === 'youtube' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <MultiVideoSelectorPc
                  active={this.state.videoState.isMulti!}
                  name={this.state.videoState.name!}
                  selected={this.state.selectedVideo}
                  onSelect={index => this.setState({ selectedVideo: index })}
                />
                <Youtube
                  isPc={true}
                  videoState={this.state.videoState}
                  selectedVideo={this.state.selectedVideo}
                  timeDelta={this.state.timeDelta}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Video
                  isPc={true}
                  videoState={this.state.videoState}
                  timeDelta={this.state.timeDelta}
                />
              </motion.div>
            )
          ) : (
            <PcChatPanel layoutId={'navigator'} isRadio={this.state.isRadio}>
              <PcChatCardStack layoutId={'card-stack'}>
                {totalCard}
                {directCard}
                {wadizCard}
                <>
                  {this.state.radioState.active && this.state.radioState.vote.length && (
                    <PcRadioVoteWrapper>
                      <RadioVote
                        radio={this.state.radioState}
                        timeDelta={this.state.timeDelta}
                        userId={this.state.userId}
                        onSelect={this.onRadioVoteSelect}
                      />
                    </PcRadioVoteWrapper>
                  )}
                </>
              </PcChatCardStack>
            </PcChatPanel>
          )}
          {this.state.isRadio && this.state.radioState.active && (
            <PcRadioWrapper
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <RadioPc radio={this.state.radioState} timeDelta={this.state.timeDelta} />
            </PcRadioWrapper>
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
    } else if (this.state.menu === 3) {
      const onBack = () => {
        this.setState({ menu: 0 });
      };
      content = (
        <ChartBackground layoutId={'navigator'}>
          <ChartTitle onBack={onBack} />
          <ChartMobileText>PC 환경으로 접속해주세요</ChartMobileText>
        </ChartBackground>
      );
      pcContent = (
        <ChartBackground layoutId={'navigator'}>
          <ChartTitle onBack={onBack} isPc={true} />
          <ChartHeading data={this.state.candleData} />
          <ChartPcWrapper>
            <Chart data={this.state.candleData} />
          </ChartPcWrapper>
          <StatisticsPcWrapper>
            <Statistics data={this.state.candleData} />
          </StatisticsPcWrapper>
        </ChartBackground>
      );
    } else if (this.state.menu === 4) {
      content = <Loading />;
      pcContent = content;
    } else if (this.state.menu === 5) {
      content = <OutOfService onContinue={() => this.setState({ menu: 0 })} />;
      pcContent = content;
    }

    return (
      <AnimateSharedLayout>
        <MediaQuery maxWidth={1024}>
          {this.state.menu !== 4 && (
            <Navigator
              onClick={this.onNavigatorClick}
              active={this.state.menu}
              display={![1, 3, 4, 5].includes(this.state.menu)}
            />
          )}
          {content}
        </MediaQuery>
        <MediaQuery minWidth={1024}>
          {![1, 3, 4, 5].includes(this.state.menu) && (
            <NavigatorPc onClick={this.onNavigatorClick} active={this.state.menu} />
          )}
          {pcContent}
        </MediaQuery>
      </AnimateSharedLayout>
    );
  }
}
