import React, { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { getEmoticonUrlByKey } from '../../utils/emoticon';
import CustomFeed from './CustomFeed';
import EmoticonBubble from './EmoticonBubble';
import InstagramUpdateFeed from './InstagramUpdateFeed';
import TextBubble from './TextBubble';
import TweetFeed from './TweetFeed';
import WadizGroupFeed from './WadizGroupFeed';
import WadizUpdateFeed from './WadizUpdateFeed';

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
  userId: string;
  role: number;
  nickname: string;
  profileImageUrl: string;
  emoticons: EmoticonSet[];
}

export default class ChatSet extends Component<Props, any> {
  render() {
    let profileImage = this.props.profileImageUrl;
    if (this.props.role === 2) profileImage = 'http://lt2.kr/image/logo.iz.3.png';
    if (this.props.role === 1) profileImage = 'http://lt2.kr/image/logo.iz.4.png';

    if (this.props.userId === '#') {
      return this.props.chats.map((chat, index) => {
        if (chat.type === 'feed') return <CustomFeed text={chat.content} key={'f' + index} />;

        if (chat.type === 'chat-clear')
          return <CustomFeed text={'채팅을 클리어 했습니다'} key={'f' + index} />;

        if (chat.type === 'ig-photo-update')
          return (
            <InstagramUpdateFeed
              type={'post'}
              username={chat.username}
              profileImage={chat.profile_image}
              url={chat.url}
              key={'f' + index}
            />
          );

        if (chat.type === 'ig-story-update')
          return (
            <InstagramUpdateFeed
              type={'story'}
              username={chat.username}
              profileImage={chat.profile_image}
              url={chat.url}
              key={'f' + index}
            />
          );

        if (chat.type === 'tweet-in') {
          return <TweetFeed type={'in'} name={chat.name} rank={chat.rank} key={'f' + index} />;
        }

        if (chat.type === 'tweet-update') {
          return (
            <TweetFeed
              type={'update'}
              name={chat.name}
              from={chat.from}
              to={chat.to}
              key={'f' + index}
            />
          );
        }

        if (chat.type === 'tweet-out') {
          return <TweetFeed type={'out'} name={chat.name} key={'f' + index} />;
        }
      });
    }

    if (this.props.userId === '#wadiz-feed') {
      if (this.props.chats.length > 2) {
        return <WadizGroupFeed feeds={this.props.chats as WadizUpdateChat[]} />;
      } else {
        return this.props.chats.map((chat, index) => {
          if (chat.type === 'wadiz-update')
            return <WadizUpdateFeed delta={chat.delta} key={'f' + index} />;
        });
      }
    }

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
              const key = getEmoticonUrlByKey(this.props.emoticons, chat.key);
              if (!key) return false;
              return <EmoticonBubble emotionUrl={key} key={index} />;
            }
            return true;
          })}
        </Content>
      </Layout>
    );
  }
}
