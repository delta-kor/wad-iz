import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled.div`
  position: relative;
  height: 220px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;
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
  margin: 0 0 0 6px;
  height: 12px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 100px;
`;

interface Props {
  total: number;
  up: number;
  down: number;
}

export default class DayCard extends Component<Props, any> {
  render() {
    const upPercentage = (this.props.total / this.props.up) * 100;
    return (
      <Layout>
        <Title>24시간</Title>
        <Total>{Transform.toCurrency(this.props.total)}</Total>
        <Up>+ {Transform.toCurrency(this.props.up)}</Up>
        <Down>- {Transform.toCurrency(this.props.down)}</Down>
        <GraphWrapper>
          <UpGraph
            animate={{ width: upPercentage + '%' }}
            transition={{ type: 'spring', damping: 30 }}
          />
          <DownGraph
            animate={{ width: `calc(100% - ${upPercentage}%)` }}
            transition={{ delay: 0.25, type: 'spring', bounce: 0.7, damping: 30 }}
          />
        </GraphWrapper>
      </Layout>
    );
  }
}
