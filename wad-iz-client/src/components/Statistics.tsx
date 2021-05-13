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
  meta: ChartMeta;
}

export default class Statistics extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <Title>펀딩액 통계 ( 24시간 )</Title>
        <ItemWrapper>
          <ItemTitle>총합</ItemTitle>
          <ItemContent>{Transform.toCurrency(this.props.meta.total)}</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>변동</ItemTitle>
          <ItemContent>{Transform.toCurrencyDelta(this.props.meta.delta)}</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>고가</ItemTitle>
          <ItemContent>{Transform.toCurrency(this.props.meta.highest)}</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>저가</ItemTitle>
          <ItemContent>{Transform.toCurrency(this.props.meta.lowest)}</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>거래</ItemTitle>
          <ItemContent>{this.props.meta.volume} 회</ItemContent>
        </ItemWrapper>
        <ItemWrapper>
          <ItemTitle>주문 / 취소</ItemTitle>
          <ItemContent>
            <ColorText color={Color.RED}>{this.props.meta.order} 회</ColorText>/
            <ColorText color={Color.BLUE}>{this.props.meta.cancel} 회</ColorText>
          </ItemContent>
        </ItemWrapper>
      </Layout>
    );
  }
}
