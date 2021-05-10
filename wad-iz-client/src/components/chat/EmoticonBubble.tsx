import { Component } from 'react';
import styled from 'styled-components';

const Layout = styled.img`
  display: block;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  user-select: none;
`;

interface Props {
  emotionUrl: string;
}

export default class EmoticonBubble extends Component<Props, any> {
  render() {
    return <Layout src={this.props.emotionUrl}></Layout>;
  }
}
