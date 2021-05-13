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
  meta: ChartMeta;
}

export default class ChartHeading extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <Total delta={this.props.meta.delta}>{Transform.toCurrency(this.props.meta.total)}</Total>
        <DailyTitle>24시간 대비</DailyTitle>
        <DailyContent delta={this.props.meta.delta}>
          {Transform.toCurrencyDelta(this.props.meta.delta)}
          {' ( ' +
            (this.props.meta.delta > 0 ? '+ ' : '- ') +
            (Transform.round(Math.abs(this.props.meta.delta_percent), 3) + ' % )')}
        </DailyContent>
      </Layout>
    );
  }
}
