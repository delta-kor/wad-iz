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
  display: flex;
  left: calc(50% - 108px / 2 - 422px);
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

export default class NavigatorPc extends Component<any, any> {
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
