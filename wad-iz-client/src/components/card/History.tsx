import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled(motion.div)`
  position: relative;
  height: 267px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;
`;

const Title = styled.div`
  position: absolute;
  height: 18px;
  left: 32px;
  right: 234px;
  top: 32px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const ViewChart = styled.div`
  position: absolute;
  height: 18px;
  left: 234px;
  right: 32px;
  top: 32px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  text-align: right;
  color: ${Color.BLUE};
  cursor: pointer;
`;

const HistoryWrapper = styled.div`
  display: flex;
  position: absolute;
  left: 32px;
  right: 32px;
  top: 74px;
  bottom: 32px;
  flex-direction: column;
  justify-content: space-between;
`;

const HistoryItem = styled(motion.div)`
  display: flex;
  height: 18px;
  width: 100%;
  justify-content: space-between;
`;

const HistoryAmount = styled.div<any>`
  width: 154px;
  height: 18px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: ${({ delta }) => (delta > 0 ? Color.RED : Color.BLUE)};
`;

const HistoryTime = styled.div`
  height: 18px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: right;
  color: ${Color.BLACK};
`;

interface Props {
  delay?: number;
  items: HistoryItem[];
}

interface State {
  currentTime: number;
}

export default class HistoryCard extends Component<Props, State> {
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

  onChartClick = () => {
    alert('업데이트 중입니다');
  };

  render() {
    const items = [];
    let index = 0;
    for (const item of this.props.items) {
      const timeDelta = (this.state.currentTime - item.time) / 1000;
      items.push(
        <HistoryItem
          key={index}
          initial={{ zoom: 0, opacity: 0 }}
          animate={{ zoom: 1, opacity: 1 }}
          transition={{ delay: (this.props.delay || 0) + index * 0.05 }}
        >
          <HistoryAmount delta={item.delta}>{Transform.toCurrencyDelta(item.delta)}</HistoryAmount>
          <HistoryTime>{Transform.toTimeHistoryText(timeDelta)}</HistoryTime>
        </HistoryItem>
      );
      index++;
    }

    return (
      <Layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: this.props.delay || 0 }}
      >
        <Title>기록</Title>
        <ViewChart onClick={this.onChartClick}>차트 보기</ViewChart>
        <HistoryWrapper>{items}</HistoryWrapper>
      </Layout>
    );
  }
}
