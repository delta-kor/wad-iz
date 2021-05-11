import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';

const Layout = styled.div`
  display: inline-block;
  padding: 10px 16px;
  background: ${Color.BLUE};
  border-radius: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: ${Color.WHITE};
  word-break: break-all;
`;

interface Props {
  chat: TextChat;
}

export default class TextBubble extends Component<Props, any> {
  render() {
    return <Layout>{this.props.chat.content}</Layout>;
  }
}
