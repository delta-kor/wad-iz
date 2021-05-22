import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../styles/color';
import { Transform } from '../utils/transform';

const Layout = styled.div`
  display: flex;
  padding: 32px;
  width: 100%;
  height: 100%;
  background: ${Color.BACKGROUND};
  border-radius: 16px;
  flex-direction: column;
  gap: 32px 0;
  overflow-y: scroll;
`;

const Title = styled.div`
  height: 24px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const ItemWrapper = styled.div`
  display: flex;
  gap: 12px 0;
  flex-direction: column;
`;

const ItemTitle = styled.div`
  height: 14px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  color: ${Color.GRAY};
`;

const ItemContent = styled.div`
  display: flex;
  height: 18px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: ${Color.BLACK};
  gap: 0 8px;
`;

const ColorText = styled.div<any>`
  display: inline-block;
  color: ${({ color }) => color};
`;

interface Props {
  data: CandleData[];
}

interface State {
  currentTime: number;
}

export default class Statistics extends Component<Props, State> {
  interval: any;

  state = {
    currentTime: new Date().getTime(),
  };

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ currentTime: new Date().getTime() }), 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const items = this.props.data.filter(
      v => v.timestamp.getTime() >= this.state.currentTime - 86400000
    );

    let total: number = items[0].to,
      delta: number = items[0].to - items.slice(-1)[0].from,
      highest: number = 0,
      lowest: number = Infinity,
      volume: number = 0,
      order: number = 0,
      cancel: number = 0;

    for (const item of items) {
      highest = Math.max(highest, item.from, item.to);
      lowest = Math.min(lowest, item.from, item.to);
      volume++;
      if (item.delta > 0) order++;
      else cancel++;
    }

    return (
      <Layout>
        <Title>펀딩액 통계 ( 24시간 )</Title>
        <ItemWrapper>
          <ItemTitle>총합</ItemTitle>
          <ItemContent>{Transform.toCurrency(total)}</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>변동</ItemTitle>
          <ItemContent>{Transform.toCurrencyDelta(delta)}</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>고가</ItemTitle>
          <ItemContent>{Transform.toCurrency(highest)}</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>저가</ItemTitle>
          <ItemContent>{Transform.toCurrency(lowest)}</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>거래</ItemTitle>
          <ItemContent>{volume} 회</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>주문 / 취소</ItemTitle>
          <ItemContent>
            <ColorText color={Color.RED}>{order} 회</ColorText>/
            <ColorText color={Color.BLUE}>{cancel} 회</ColorText>
          </ItemContent>
        </ItemWrapper>
      </Layout>
    );
  }
}
