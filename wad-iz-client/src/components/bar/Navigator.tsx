import { Component } from 'react';
import styled from 'styled-components';
import ChatIcon from '../../icon/chat-nav.svg';
import PlanetIcon from '../../icon/planet-nav.svg';
import SettingsIcon from '../../icon/settings-nav.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import NavigatorItem from './NavigatorItem';

const Layout = styled.div`
  position: fixed;
  display: grid;
  bottom: 0;
  left: 0;
  right: 0;
  height: 108px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.UP};
  grid-template-columns: repeat(3, 56px);
  column-gap: 42px;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;

interface Props {
  onClick: (index: number) => void;
  active: number;
}

export default class Navigator extends Component<Props, any> {
  render() {
    return (
      <Layout>
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
          onClick={() => this.props.onClick(2)}
          active={this.props.active === 2}
          src={SettingsIcon}
        />
      </Layout>
    );
  }
}
