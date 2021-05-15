import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import EmoticonBubble from './EmoticonBubble';
import TextBubble from './TextBubble';

const Layout = styled.div`
  display: flex;
  gap: 0 16px;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 100px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px 0;
`;

const Nickname = styled.div`
  display: flex;
  gap: 0 8px;
`;

const NicknameRole = styled.div<any>`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 24px;
  color: ${({ role }) => (role === 0 ? Color.BLACK : role === 1 ? Color.BLUE : Color.RED)};
`;

const NicknameContent = styled.div<any>`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${Color.BLACK};
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
    let profileImage = this.props.profileImageUrl;
    if (this.props.role === 2) profileImage = 'http://lt2.kr/image/logo.iz.3.png';
    if (this.props.role === 1) profileImage = 'http://lt2.kr/image/logo.iz.4.png';

    return (
      <Layout>
        <ProfileImage src={profileImage} />
        <Content>
          <Nickname>
            {this.props.role > 0 && (
              <NicknameRole role={this.props.role}>
                {this.props.role === 1 ? '부방장' : '방장'}
              </NicknameRole>
            )}
            <NicknameContent>{this.props.nickname}</NicknameContent>
          </Nickname>
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
