import { Component } from 'react';
import styled from 'styled-components';
import PlanetIcon from '../icon/planet.svg';
import TwitterIcon from '../icon/twitter.svg';
import YoutubeIcon from '../icon/youtube.svg';
import { Color } from '../styles/color';
import { Shadow } from '../styles/shadow';

const Layout = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 358px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 0px 0px 36px 36px;
`;

const IconMenu = styled.div`
  position: relative;
  top: 64px;
  left: 0;
  right: 0;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(3, 32px);
  column-gap: 28px;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

const Amount = styled.div`
  position: absolute;
  height: 36px;
  left: 0;
  right: 0;
  top: 138px;
  font-family: Product Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 24px;
  text-align: center;
  color: ${Color.WHITE};
`;

const Description = styled.div`
  position: absolute;
  height: 16px;
  left: 36px;
  right: 36px;
  top: 190px;
  font-family: Noto Sans KR;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${Color.WHITE};
`;

interface Props {
  amount: number;
}

export default class Cover extends Component<any, any> {
  render() {
    return (
      <Layout>
        <IconMenu>
          <Icon src={PlanetIcon} />
          <Icon src={TwitterIcon} />
          <Icon src={YoutubeIcon} />
        </IconMenu>
        <Amount>3,237,563,210 ₩</Amount>
        <Description>32억 3756만 3210 원</Description>
      </Layout>
    );
  }
}
