import { Component } from 'react';
import styled from 'styled-components';
import { Shadow } from '../../styles/shadow';

const Layout = styled.img`
  display: block;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  box-shadow: ${Shadow.DOWN};
`;

interface Props {
  emotionUrl: string;
}

export default class EmoticonBubble extends Component<Props, any> {
  render() {
    return <Layout src={this.props.emotionUrl}></Layout>;
  }
}
