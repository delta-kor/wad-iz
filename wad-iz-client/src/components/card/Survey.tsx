import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled(motion.div)`
  position: relative;
  height: 239px;
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

const GraphBlockWrapper = styled.div`
  position: absolute;
  display: grid;
  top: 66px;
  height: 84px;
  left: 0;
  right: 0;
  row-gap: 16px;
  padding: 0 32px;
`;

const GraphBlock = styled.div`
  position: relative;
  height: 34px;
`;

const GraphTitle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 96px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const GraphLabel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 64px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  text-align: right;
  color: ${Color.BLUE};
`;

const GraphWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 8px;
  display: flex;
  gap: 0 6px;
`;

const KwizGraph = styled(motion.div)`
  display: inline-block;
  height: 8px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 100px;
`;

const EmptyGraph = styled(motion.div)`
  display: inline-block;
  height: 8px;
  background: #f6f4fa;
  border-radius: 100px;
  flex-grow: 1;
`;

const LabelWrapper = styled.div`
  position: absolute;
  display: grid;
  top: 172px;
  bottom: 32px;
  left: 0;
  right: 0;
  row-gap: 6px;
`;

const LabelItem = styled.div`
  position: relative;
  height: 14px;
`;

const LabelIconKwiz = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  top: 2px;
  left: calc(50% - 10px / 2 - 27px);
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 10px;
`;

const LabelTitleKwiz = styled.div`
  position: absolute;
  width: 42px;
  height: 14px;
  left: calc(50% - 42px / 2 + 12px);
  top: 0;
  font-style: normal;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  color: ${Color.BLUE};
`;

const LabelIconIwiz = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  top: 2px;
  left: calc(50% - 10px / 2 - 27px);
  background: ${Color.RED};
  box-shadow: ${Shadow.RED};
  border-radius: 10px;
`;

const LabelTitleIwiz = styled.div`
  position: absolute;
  width: 42px;
  height: 14px;
  left: calc(50% - 42px / 2 + 12px);
  top: 0;
  font-style: normal;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  color: ${Color.RED};
`;

interface Props {
  totalAmount: number;
  totalSupporter: number;
  kwizAmount: number;
  kwizSupporter: number;
  delay?: number;
}

export default class SurveyCard extends Component<Props, any> {
  render() {
    const kwizAmountPercentage = (this.props.kwizAmount / this.props.totalAmount) * 100;
    const kwizSupporterPercentage = (this.props.kwizSupporter / this.props.totalSupporter) * 100;
    return (
      <Layout
        initial={{ zoom: 1, opacity: 0 }}
        animate={{ zoom: 1, opacity: 1 }}
        transition={{ delay: this.props.delay || 0 }}
      >
        <Title>수요조사</Title>
        <GraphBlockWrapper>
          <GraphBlock>
            <GraphTitle>참여 금액</GraphTitle>
            <GraphLabel>{Transform.round(kwizAmountPercentage, 2)} %</GraphLabel>
            <GraphWrapper>
              <KwizGraph
                animate={{ width: Math.min(100, kwizAmountPercentage) + '%' }}
                transition={{ type: 'spring', damping: 30, delay: this.props.delay || 0 }}
              />
              {kwizAmountPercentage < 100 && <EmptyGraph />}
            </GraphWrapper>
          </GraphBlock>
          <GraphBlock>
            <GraphTitle>참여 인원</GraphTitle>
            <GraphLabel>{Transform.round(kwizSupporterPercentage, 2)} %</GraphLabel>
            <GraphWrapper>
              <KwizGraph
                animate={{ width: Math.min(100, kwizSupporterPercentage) + '%' }}
                transition={{ type: 'spring', damping: 30, delay: (this.props.delay || 0) + 0.25 }}
              />
              {kwizSupporterPercentage < 100 && <EmptyGraph />}
            </GraphWrapper>
          </GraphBlock>
        </GraphBlockWrapper>
        <LabelWrapper>
          <LabelItem>
            <LabelIconKwiz />
            <LabelTitleKwiz>K-WIZ</LabelTitleKwiz>
          </LabelItem>
          <LabelItem>
            <LabelIconIwiz />
            <LabelTitleIwiz>I-WIZ</LabelTitleIwiz>
          </LabelItem>
        </LabelWrapper>
      </Layout>
    );
  }
}
