import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Transform } from '../../utils/transform';

const Layout = styled.div`
  position: relative;
  height: 124px;
  width: 100%;
`;

const Total = styled.div<any>`
  position: absolute;
  width: 515px;
  height: 24px;
  left: 64px;
  top: 0px;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 24px;
  color: ${({ delta }) => (delta > 0 ? Color.RED : Color.BLUE)};
`;

const DailyTitle = styled.div`
  position: absolute;
  width: 148px;
  height: 24px;
  left: 64px;
  top: 52px;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const DailyContent = styled.div<any>`
  position: absolute;
  width: 397px;
  height: 24px;
  left: 212px;
  top: 52px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: ${({ delta }) => (delta > 0 ? Color.RED : Color.BLUE)};
`;

interface Props {
  data: CandleData[];
}

export default class ChartHeading extends Component<Props, any> {
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
      deltaPercent: number = (delta / items.slice(-1)[0].from) * 100;

    return (
      <Layout>
        <Total delta={delta}>{Transform.toCurrency(total)}</Total>
        <DailyTitle>24시간 대비</DailyTitle>
        <DailyContent delta={delta}>
          {Transform.toCurrencyDelta(delta)}
          {' ( ' +
            (delta > 0 ? '+ ' : '- ') +
            (Transform.round(Math.abs(deltaPercent), 3) + ' % )')}
        </DailyContent>
      </Layout>
    );
  }
}
