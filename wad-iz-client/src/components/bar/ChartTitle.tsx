import { Component } from 'react';
import styled from 'styled-components';
import BackIcon from '../../icon/back.svg';
import { Color } from '../../styles/color';

const Layout = styled.div<Partial<Props>>`
  width: 100%;
  height: ${({ isPc }) => (isPc ? '148px' : '76px')};
  background: ${Color.WHITE};
  user-select: none;
`;

const Back = styled.img<Partial<Props>>`
  position: fixed;
  top: ${({ isPc }) => (isPc ? '64px' : '28px')};
  left: ${({ isPc }) => (isPc ? '64px' : '24px')};
  width: ${({ isPc }) => (isPc ? '36px' : '24px')};
  height: ${({ isPc }) => (isPc ? '36px' : '24px')};
  cursor: pointer;
`;

const Title = styled.div<Partial<Props>>`
  position: absolute;
  width: 128px;
  height: ${({ isPc }) => (isPc ? '36px' : '24px')};
  left: ${({ isPc }) => (isPc ? '136px' : '72px')};
  top: ${({ isPc }) => (isPc ? '64px' : '28px')};
  font-style: normal;
  font-weight: normal;
  font-size: ${({ isPc }) => (isPc ? '36px' : '24px')};
  line-height: ${({ isPc }) => (isPc ? '36px' : '24px')};
  color: ${Color.GRAY};
`;

interface Props {
  onBack(): void;
  isPc?: boolean;
}

export default class ChartTitle extends Component<Props, any> {
  render() {
    return (
      <Layout isPc={this.props.isPc}>
        <Back src={BackIcon} onClick={this.props.onBack} isPc={this.props.isPc} />
        <Title isPc={this.props.isPc}>통계</Title>
      </Layout>
    );
  }
}
