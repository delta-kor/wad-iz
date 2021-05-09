import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';
import Navigator from './components/bar/Navigator';
import DayCard from './components/card/Day';
import MoneyCard from './components/card/Money';
import SurveyCard from './components/card/Survey';
import Cover from './components/Cover';
import Socket from './utils/socket';
import { Transform } from './utils/transform';

const CardStack = styled.div`
  display: grid;
  margin: -94px 0 0 0;
  padding: 0 36px 132px 36px;
  row-gap: 24px;
`;

interface State {
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

  render() {
    return (
      <MediaQuery maxWidth={1024}>
        <Cover amount={this.state.directAmount + this.state.wadizAmount}></Cover>
        <CardStack>
          <MoneyCard
            title={'직영'}
            label={this.state.directLastUpdate}
            amount={this.state.directAmount}
          />
          <MoneyCard
            title={'wadiz'}
            label={Transform.toSupporterText(this.state.wadizSupporter)}
            amount={this.state.wadizAmount}
          />
          <DayCard
            total={this.state.dailyUp - this.state.dailyDown}
            up={this.state.dailyUp}
            down={this.state.dailyDown}
          />
          <SurveyCard
            totalAmount={3341459287}
            totalSupporter={9846}
            kwizAmount={this.state.directAmount + this.state.wadizAmount}
            kwizSupporter={this.state.wadizSupporter}
          />
        </CardStack>
        <Navigator />
      </MediaQuery>
    );
  }
}
