import { Component } from 'react';
import styled from 'styled-components';
import GithubIcon from '../icon/github.svg';
import { Color } from '../styles/color';

const Layout = styled.a`
  position: fixed;
  display: fixed;
  bottom: 52px;
  left: 50%;
  transform: translate(-50%);
  align-items: center;
  justify-content: center;
  gap: 0 8px;
  user-select: none;
  text-decoration: none;
`;

const MobileLayout = styled.a`
  display: fixed;
  bottom: 52px;
  align-items: center;
  justify-content: center;
  gap: 0 8px;
  user-select: none;
  text-decoration: none;
`;

const Text = styled.div`
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 26px;
  display: flex;
  align-items: center;
  text-align: center;
  color: ${Color.GRAY};
`;

const Nickname = styled.div`
  display: inline-block;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 26px;
  display: flex;
  align-items: center;
  text-align: center;
  color: ${Color.GRAY};
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
`;

interface Props {
  isPc: boolean;
}

export default class Copyright extends Component<Props, any> {
  render() {
    if (this.props.isPc)
      return (
        <Layout href={'https://github.com/delta-kor/wad-iz'} target={'_blank'}>
          <Text>©️ 2021</Text>
          <Nickname>delta-kor</Nickname>
          <Icon src={GithubIcon} />
        </Layout>
      );
    return (
      <MobileLayout href={'https://github.com/delta-kor/wad-iz'} target={'_blank'}>
        <Text>©️ 2021</Text>
        <Nickname>delta-kor</Nickname>
        <Icon src={GithubIcon} />
      </MobileLayout>
    );
  }
}
