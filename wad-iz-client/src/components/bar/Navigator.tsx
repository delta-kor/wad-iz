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
`;

export default class Navigator extends Component<any, any> {
  render() {
    return (
      <Layout>
        <NavigatorItem active={true} src={PlanetIcon} />
        <NavigatorItem active={false} src={ChatIcon} />
        <NavigatorItem active={false} src={SettingsIcon} />
      </Layout>
    );
  }
}
