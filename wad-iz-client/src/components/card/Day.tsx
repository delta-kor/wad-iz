import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled(motion.div)`
  position: relative;
  height: 220px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;
  z-index: 2;
`;

const Title = styled.div`
  position: absolute;
  height: 18px;
  left: 32px;
  right: 32px;
  top: 32px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const Total = styled.div`
  position: absolute;
  height: 24px;
  left: 32px;
  right: 32px;
  top: 66px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const Up = styled.div`
  position: absolute;
  height: 18px;
  left: 64px;
  right: 32px;
  top: 106px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: ${Color.RED};
`;

const Down = styled.div`
  position: absolute;
  height: 18px;
  left: 64px;
  right: 32px;
  top: 134px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: ${Color.BLUE};
`;

const GraphWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 176px;
  left: 32px;
  right: 32px;
  height: 12px;
  gap: 0 6px;
`;

const UpGraph = styled(motion.div)`
  display: inline-block;
  width: 0;
  height: 12px;
  background: ${Color.RED};
  box-shadow: ${Shadow.RED};
  border-radius: 100px;
`;

const DownGraph = styled(motion.div)`
  display: inline-block;
  width: 0;
  height: 12px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 100px;
`;

interface Props {
  delay?: number;
  data: CandleData[];
}

interface State {
  currentTime: number;
}

export default class DayCard extends Component<Props, State> {
  interval: any;

  state = {
    currentTime: new Date().getTime(),
  };

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ currentTime: new Date().getTime() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const items = this.props.data.filter(
      v => v.timestamp.getTime() >= this.state.currentTime - 86400000
    );

    let up: number = 1;
    let down: number = 1;
    for (const item of items) {
      if (item.delta > 0) up += item.delta;
      if (item.delta < 0) down -= item.delta;
    }

    const upPercentage = (up / (up + down)) * 100;
    return (
      <Layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: this.props.delay || 0 }}
        layoutId={'dashboard-card'}
      >
        <Title>24시간</Title>
        <Total>{Transform.toCurrency(up - down)}</Total>
        <Up>+ {Transform.toCurrency(up)}</Up>
        <Down>- {Transform.toCurrency(down)}</Down>
        <GraphWrapper>
          <UpGraph
            animate={{ width: upPercentage + '%' }}
            transition={{ type: 'spring', damping: 30, delay: (this.props.delay || 0) + 0 }}
          />
          <DownGraph
            animate={{ width: `calc(100% - ${upPercentage}%)` }}
            transition={{
              type: 'spring',
              bounce: 0.7,
              damping: 30,
              delay: (this.props.delay || 0) + 0.25,
            }}
          />
        </GraphWrapper>
      </Layout>
    );
  }
}
