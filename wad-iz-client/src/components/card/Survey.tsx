import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled.div`
  position: relative;
  height: 239px;
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
  width: 58px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  text-align: right;
  color: ${Color.BLUE};
`;

interface Props {
  totalAmount: number;
  totalSupporter: number;
  kwizAmount: number;
  kwizSupporter: number;
}

export default class SurveyCard extends Component<Props, any> {
  render() {
    const kwizAmountPercentage =
      Transform.round((this.props.kwizAmount / this.props.totalAmount) * 100, 2) + ' %';
    const kwizSupporterPercentage =
      Transform.round((this.props.kwizSupporter / this.props.totalSupporter) * 100, 2) + ' %';
    return (
      <Layout>
        <Title>수요조사</Title>
        <GraphBlockWrapper>
          <GraphBlock>
            <GraphTitle>참여 금액</GraphTitle>
            <GraphLabel>{kwizAmountPercentage}</GraphLabel>
          </GraphBlock>
          <GraphBlock>
            <GraphTitle>참여 인원</GraphTitle>
            <GraphLabel>{kwizSupporterPercentage}</GraphLabel>
          </GraphBlock>
        </GraphBlockWrapper>
      </Layout>
    );
  }
}
