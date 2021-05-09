import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';
import Navigator from './components/bar/Navigator';
import NavigatorPc from './components/bar/NavigatorPc';
import DayCard from './components/card/Day';
import MoneyCard from './components/card/Money';
import SurveyCard from './components/card/Survey';
import TotalCard from './components/card/Total';
import Cover from './components/Cover';
import Profile from './components/Profile';
import Socket from './utils/socket';
import { Transform } from './utils/transform';

const CardStack = styled.div`
  display: grid;
  margin: -94px 0 0 0;
  padding: 0 36px 132px 36px;
  row-gap: 24px;
`;

const PcCardStackLeft = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: calc(50% - 342px / 2 - 69px);
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
  left: calc(50% - 342px / 2 + 305px);
  width: 342px;
  flex-direction: column;
  justify-content: center;
  gap: 32px 0;
`;

const ProfileWrapper = styled.div`
  position: absolute;
  height: 276px;
  left: 0px;
  right: 0px;
  top: calc(50% - 276px / 2);
`;

interface State {
  menu: number;
  directAmount: number;
  directLastUpdate: string;
  wadizAmount: number;
  wadizSupporter: number;
  dailyUp: number;
  dailyDown: number;
}

export default class App extends Component<any, State> {
  private socket!: Socket;

  constructor(props: any) {
    super(props);
    this.state = {
      menu: 0,
      directAmount: 0,
      directLastUpdate: '',
      wadizAmount: 0,
      wadizSupporter: 0,
      dailyUp: 1,
      dailyDown: 1,
    };
  }

  componentDidMount() {
    this.socket = new Socket();

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
      this.setState({ wadizAmount: packet.amount, wadizSupporter: packet.supporter });
    });
    this.socket.on('daily-sync', (packet: DailySyncServerPacket) => {
      this.setState({ dailyUp: packet.up, dailyDown: packet.down });
    });
    this.socket.on('daily-update', (packet: DailyUpdateServerPacket) => {
      this.setState({ dailyUp: packet.up, dailyDown: packet.down });
    });
    this.socket.on('multiple-connect', () => {
      alert('다른 기기에서 접속하여 서버와의 연결을 끊었습니다');
    });
  }

  onNavigatorClick = (index: number) => {
    if (index === 0 || index === 2) this.setState({ menu: index });
  };

  render() {
    const directCard = (
      <MoneyCard
        title={'직영'}
        label={this.state.directLastUpdate}
        amount={this.state.directAmount}
      />
    );
    const wadizCard = (
      <MoneyCard
        title={'wadiz'}
        label={Transform.toSupporterText(this.state.wadizSupporter)}
        amount={this.state.wadizAmount}
      />
    );
    const dayCard = (
      <DayCard
        total={this.state.dailyUp - this.state.dailyDown}
        up={this.state.dailyUp}
        down={this.state.dailyDown}
      />
    );
    const surveyCard = (
      <SurveyCard
        totalAmount={3341459287}
        totalSupporter={9846}
        kwizAmount={this.state.directAmount + this.state.wadizAmount}
        kwizSupporter={this.state.wadizSupporter}
      />
    );

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
          </CardStack>
        </div>
      );
      pcContent = (
        <div>
          <PcCardStackLeft>
            <TotalCard amount={this.state.directAmount + this.state.wadizAmount} />
            {directCard}
            {wadizCard}
          </PcCardStackLeft>
          <PcCardStackRight>
            {dayCard}
            {surveyCard}
          </PcCardStackRight>
        </div>
      );
    } else if (this.state.menu === 2) {
      content = (
        <ProfileWrapper>
          <Profile nickname={this.socket.nickname!} profileImageUrl={'http://lt2.kr/izone.png'} />
        </ProfileWrapper>
      );
      pcContent = (
        <div>
          <Profile nickname={this.socket.nickname!} profileImageUrl={'http://lt2.kr/izone.png'} />
        </div>
      );
    }

    return (
      <div>
        <MediaQuery maxWidth={1024}>
          <Navigator onClick={this.onNavigatorClick} active={this.state.menu} />
          {content}
        </MediaQuery>
        <MediaQuery minWidth={1024}>
          <NavigatorPc onClick={this.onNavigatorClick} active={this.state.menu} />
          {pcContent}
        </MediaQuery>
      </div>
    );
  }
}
