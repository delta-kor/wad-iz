import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import PlanetIcon from '../icon/planet.svg';
import TwitterIcon from '../icon/twitter.svg';
import YoutubeIcon from '../icon/youtube.svg';
import { Color } from '../styles/color';
import { Shadow } from '../styles/shadow';
import { Transform } from '../utils/transform';

const Layout = styled.div`
  position: sticky;
  top: -294px;
  left: 0;
  right: 0;
  height: 358px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 0px 0px 36px 36px;
  z-index: 1;
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

const Icon = styled.a<any>`
  width: 32px;
  height: 32px;
  background: url(${({ src }) => src});
`;

const Amount = styled(motion.div)`
  position: absolute;
  height: 36px;
  left: 0;
  right: 0;
  top: 138px;
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

export default class Cover extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <IconMenu>
          <Icon src={PlanetIcon} href={'https://reboot-iz.one'} target={'_blank'} />
          <Icon src={TwitterIcon} href={'https://twitter.com/IZ_PU_Project'} target={'_blank'} />
          <Icon
            src={YoutubeIcon}
            href={'https://www.youtube.com/channel/UCggkfNlQFPdAKyE6FqNcFaA'}
            target={'_blank'}
          />
        </IconMenu>
        <Amount layoutId={'total_amount'}>{Transform.toCurrency(this.props.amount)}</Amount>
        <Description>{Transform.toCurrencyLocaleNumber(this.props.amount)}</Description>
      </Layout>
    );
  }
}
