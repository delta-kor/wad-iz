import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../styles/color';
import { Shadow } from '../styles/shadow';

const Layout = styled.div`
  height: 395px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 0px 0px 36px 36px;
`;

export default class Cover extends Component<any, any> {
  render() {
    return <Layout></Layout>;
  }
}
