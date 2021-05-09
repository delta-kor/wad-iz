import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';

const Layout = styled.div`
  display: inline-block;
  padding: 14px 18px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 8px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
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
