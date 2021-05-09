import { Component } from 'react';
import styled from 'styled-components';
import { Shadow } from '../../styles/shadow';
import TextBubble from './TextBubble';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  column-gap: 16px;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  box-shadow: ${Shadow.DOWN};
  border-radius: 100px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px 0;
`;

const Nickname = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #1a191d;
`;

interface Props {
  chats: Chat[];
  nickname: string;
  profileImageUrl: string;
}

export default class ChatSet extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <ProfileImage src={this.props.profileImageUrl} />
        <Content>
          <Nickname>{this.props.nickname}</Nickname>
          {this.props.chats.map((chat, index) => {
            if (chat.type === 'text') return <TextBubble chat={chat} key={index} />;
            return true;
          })}
        </Content>
      </Layout>
    );
  }
}
