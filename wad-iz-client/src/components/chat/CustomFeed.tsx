import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';

const Layout = styled.div`
  height: 24px;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLACK};
`;

interface Props {
  text: string;
}

export default class CustomFeed extends Component<Props, any> {
  render() {
    return <Layout>{this.props.text}</Layout>;
  }
}
