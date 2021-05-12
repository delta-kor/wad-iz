import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled(motion.div)`
  position: relative;
  height: 192px;
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

const GraphWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  left: 32px;
  right: 32px;
  top: 66px;
  bottom: 32px;
`;

const GraphItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 14px;
  height: 100%;
  gap: 8px 0;
`;

const GraphTop = styled.div`
  display: flex;
  width: 8px;
  height: 100%;
  align-items: flex-end;
`;

const GraphIndicator = styled(motion.div)<any>`
  width: 100%;
  background: ${({ today }) => (today ? Color.GRAY : Color.BLUE)};
  border-radius: 100px;
`;

const GraphLabel = styled.div`
  width: 14px;
  height: 14px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: ${Color.GRAY};
`;

interface Props {
  delay?: number;
  items: WeeklyItem[];
}

export default class WeeklyCard extends Component<Props, any> {
  onGraphClick = (day: number, amount: number, isToday: boolean) => {
    alert(
      `${Transform.toDayText(day)}요일${isToday ? ' (오늘)' : ''}\n종가 : ${Transform.toCurrency(
        amount
      )}`
    );
  };

  render() {
    let max: any, min: any;
    for (const item of this.props.items) {
      if (!max || !min) {
        max = item.amount;
        min = item.amount;
        continue;
      }
      max = Math.max(item.amount, max);
      min = Math.min(item.amount, min);
    }

    const delta = max - min;

    const items = [];

    let target = this.props.items;
    if (target.length) {
      let index = 0;
      if (target[0].isToday) target = target.reverse();
      for (const item of target) {
        items.push(
          <GraphItem
            key={item.day}
            onClick={() => this.onGraphClick(item.day - 1, item.amount, item.isToday)}
          >
            <GraphTop>
              <GraphIndicator
                today={item.isToday}
                initial={{ height: 0 }}
                animate={{ height: Math.min(100, ((item.amount - min) / delta) * 100 + 20) + '%' }}
                transition={{ delay: (this.props.delay || 0) + index * 0.05 }}
              />
            </GraphTop>
            <GraphLabel>{Transform.toDayText(item.day - 1)}</GraphLabel>
          </GraphItem>
        );
        index++;
      }
    }

    return (
      <Layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: this.props.delay || 0 }}
      >
        <Title>일별</Title>
        <GraphWrapper>{items}</GraphWrapper>
      </Layout>
    );
  }
}
