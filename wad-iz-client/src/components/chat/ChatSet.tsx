import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import EmoticonBubble from './EmoticonBubble';
import TextBubble from './TextBubble';

const Layout = styled.div`
  display: flex;
  gap: 0 16px;
`;

const ProfileImage = styled.img<any>`
  width: 48px;
  height: 48px;
  border: 3px solid
    ${({ role }) => (role === 0 ? 'transparent' : role === 1 ? Color.BLUE : Color.RED)};
  border-radius: 100px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px 0;
`;

const Nickname = styled.div<any>`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${({ role }) => (role === 0 ? Color.BLACK : role === 1 ? Color.BLUE : Color.RED)};
`;

interface Props {
  chats: Chat[];
  role: number;
  nickname: string;
  profileImageUrl: string;
  emoticons: Map<string, string>;
}

export default class ChatSet extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <ProfileImage src={this.props.profileImageUrl} role={this.props.role} />
        <Content>
          <Nickname role={this.props.role}>{this.props.nickname}</Nickname>
          {this.props.chats.map((chat, index) => {
            if (chat.type === 'text') return <TextBubble chat={chat} key={index} />;
            if (chat.type === 'emoticon') {
              if (!this.props.emoticons.has(chat.key)) return false;
              return (
                <EmoticonBubble emotionUrl={this.props.emoticons.get(chat.key)!} key={index} />
              );
            }
            return true;
          })}
        </Content>
      </Layout>
    );
  }
}
