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

const DirectGraph = styled(motion.div)`
  display: inline-block;
  height: 8px;
  background: ${Color.RED};
  box-shadow: ${Shadow.RED};
  border-radius: 100px;
`;

const WadizGraph = styled(motion.div)`
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
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 172px;
  bottom: 32px;
  left: 0;
  right: 0;
  gap: 6px 0;
`;

const LabelItem = styled.div`
  display: flex;
  gap: 0 8px;
  height: 14px;
`;

const LabelIconDirect = styled.div`
  width: 10px;
  height: 10px;
  background: ${Color.RED};
  box-shadow: ${Shadow.RED};
  border-radius: 10px;
`;

const LabelTitleDirect = styled.div`
  font-style: normal;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  color: ${Color.RED};
`;

const LabelIconWadiz = styled.div`
  width: 10px;
  height: 10px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 10px;
`;

const LabelTitleWadiz = styled.div`
  font-style: normal;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  line-height: 14px;
  color: ${Color.BLUE};
`;

interface Props {
  totalAmount: number;
  totalSupporter: number;
  directAmount: number;
  wadizAmount: number;
  supporter: number;
  delay?: number;
}

export default class SurveyCard extends Component<Props, any> {
  render() {
    const directAmountPercentage = (this.props.directAmount / this.props.totalAmount) * 100;
    const wadizAmountPercentage = (this.props.wadizAmount / this.props.totalAmount) * 100;
    const amountTotalPercentage = directAmountPercentage + wadizAmountPercentage;
    const supporterPercentage = (this.props.supporter / this.props.totalSupporter) * 100;
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
            <GraphLabel>{Transform.round(directAmountPercentage, 2)} %</GraphLabel>
            <GraphWrapper>
              <WadizGraph
                animate={{ width: Math.min(100, wadizAmountPercentage) + '%' }}
                transition={{ type: 'spring', damping: 30, delay: this.props.delay || 0 }}
              />
              <DirectGraph
                animate={{ width: Math.min(100, directAmountPercentage) + '%' }}
                transition={{ type: 'spring', damping: 30, delay: this.props.delay || 0 }}
              />
              {amountTotalPercentage < 100 && <EmptyGraph />}
            </GraphWrapper>
          </GraphBlock>
          <GraphBlock>
            <GraphTitle>참여 인원</GraphTitle>
            <GraphLabel>{Transform.round(supporterPercentage, 2)} %</GraphLabel>
            <GraphWrapper>
              <WadizGraph
                animate={{ width: Math.min(100, supporterPercentage) + '%' }}
                transition={{ type: 'spring', damping: 30, delay: (this.props.delay || 0) + 0.25 }}
              />
              {supporterPercentage < 100 && <EmptyGraph />}
            </GraphWrapper>
          </GraphBlock>
        </GraphBlockWrapper>
        <LabelWrapper>
          <LabelItem>
            <LabelIconDirect />
            <LabelTitleDirect>직영</LabelTitleDirect>
          </LabelItem>
          <LabelItem>
            <LabelIconWadiz />
            <LabelTitleWadiz>wadiz</LabelTitleWadiz>
          </LabelItem>
        </LabelWrapper>
      </Layout>
    );
  }
}
