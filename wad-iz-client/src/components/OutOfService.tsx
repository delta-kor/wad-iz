import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../styles/color';

const Layout = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 42px 0;
`;

const Content = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLACK};
`;

const Text = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLACK};
`;

const Continue = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLUE};
  cursor: pointer;
  user-select: none;
`;

interface Props {
  onContinue(): void;
}

export default class OutOfService extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <Content>
          평행우주 프로젝트 실시간 집계는
          <br /> 펀딩액 환불 및 와디즈 예약 취소 이후 <br />
          2021년 7월 30일 서비스 종료 되었습니다. <br />
          <br />
          펀딩액 실시간 업데이트 및 <br />
          펀딩액 통계, 인스타그램 업데이트는 <br />
          더이상 제공되지 않습니다.
          <br />
          <br /> 그동안 많은 이용 감사합니다.
        </Content>
        <Text>
          This bud of love, by summer's ripening breath,
          <br />
          May prove a beauteous flower when next we meet.
          <br />
          <i>- William Shakespeare</i>
        </Text>
        <Continue onClick={this.props.onContinue}>계속하기</Continue>
      </Layout>
    );
  }
}
