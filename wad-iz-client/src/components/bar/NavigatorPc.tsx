import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import ChatIcon from '../../icon/chat-nav.svg';
import ListIcon from '../../icon/list.svg';
import PlanetIcon from '../../icon/planet-nav.svg';
import SettingsIcon from '../../icon/settings-nav.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import NavigatorItem from './NavigatorItem';

const Layout = styled(motion.div)`
  position: fixed;
  display: flex;
  left: calc(50% - 108px / 2 - 584px);
  top: calc(50% - 482px / 2);
  width: 108px;
  height: 482px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 32px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 42px 0;
  user-select: none;
`;

interface Props {
  onClick: (index: number) => void;
  active: number;
}

export default class NavigatorPc extends Component<Props, any> {
  render() {
    return (
      <Layout layoutId={'navigator'}>
        <NavigatorItem
          onClick={() => this.props.onClick(0)}
          active={this.props.active === 0}
          src={PlanetIcon}
        />
        <NavigatorItem
          onClick={() => this.props.onClick(1)}
          active={this.props.active === 1}
          src={ChatIcon}
        />
        <NavigatorItem
          onClick={() => this.props.onClick(3)}
          active={this.props.active === 3}
          src={ListIcon}
        />
        <NavigatorItem
          onClick={() => this.props.onClick(2)}
          active={this.props.active === 2}
          src={SettingsIcon}
        />
      </Layout>
    );
  }
}
