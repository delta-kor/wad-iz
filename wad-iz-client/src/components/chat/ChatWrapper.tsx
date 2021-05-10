import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { ChatMessage } from '../../App';
import { Transform } from '../../utils/transform';
import ChatPopup from './ChatPopup';
import ChatSet from './ChatSet';
import CustomFeed from './CustomFeed';
import WadizUpdateFeed from './WadizUpdateFeed';

const Layout = styled(motion.div)<any>`
  position: absolute;
  display: flex;
  bottom: 76px;
  padding: 24px ${({ isPc }) => (isPc ? '56px' : '32px')};
  width: 100%;
  height: calc(
    100% - 76px - 76px - ${({ isVideo }) => (isVideo ? 'min(280px, (100vw * (9 / 16)))' : '0px')}
  );
  flex-direction: column;
  justify-content: left;
  gap: 24px 0;
  overflow-y: scroll;
`;

interface MessageItem {
  userId: string;
  role: number;
  nickname: string;
  profileImageUrl: string;
  chats: Chat[];
}

interface Props {
  isPc: boolean;
  isVideo: boolean;
  messages: ChatMessage[];
  userId: string;
  emoticons: Map<string, string>;
}

interface State {
  locked: boolean;
}

export default class ChatWrapper extends Component<Props, State> {
  layoutRef!: HTMLDivElement;
  state = {
    locked: true,
  };

  componentDidUpdate() {
    if (this.state.locked && this.layoutRef) {
      this.layoutRef.scrollTop = this.layoutRef.scrollHeight;
    }
  }

  setRef(ref: HTMLDivElement) {
    this.layoutRef = ref;
    if (!ref) return false;
    this.layoutRef.addEventListener('scroll', () => {
      if (!this.layoutRef) return false;
      const delta =
        this.layoutRef.scrollHeight - this.layoutRef.scrollTop - this.layoutRef.clientHeight;
      this.setState({ locked: delta < 2 });
    });
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.layoutRef.scrollTop = this.layoutRef.scrollHeight;
  };

  render() {
    const messages: MessageItem[] = [];
    let lastUserId;
    for (const message of this.props.messages) {
      if (message.userId !== lastUserId) {
        lastUserId = message.userId;
        messages.push({
          userId: message.userId,
          role: message.role,
          nickname: message.nickname,
          profileImageUrl: message.profileImageUrl,
          chats: [],
        });
      }
      messages.slice(-1)[0].chats.push(message.chat);
    }

    let lastContent: string = '';
    const lastChat = this.props.messages.slice(-1)[0]?.chat;
    if (lastChat) {
      if (lastChat.type === 'text') {
        lastContent = lastChat.content;
      }
      if (lastChat.type === 'emoticon') {
        lastContent = '이모티콘을 보냈습니다';
      }
      if (lastChat.type === 'wadiz-update') {
        lastContent = `(wadiz) ${lastChat.delta < 0 ? '' : '+'} ${Transform.toCurrency(
          lastChat.delta
        )}`;
      }
    }

    return (
      <Layout
        isPc={this.props.isPc}
        isVideo={this.props.isVideo && !this.props.isPc}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        ref={(ref: HTMLDivElement) => this.setRef(ref)}
      >
        <ChatPopup
          content={lastContent}
          isPc={this.props.isPc}
          isVideo={this.props.isVideo && this.props.isPc}
          active={!this.state.locked}
          onClick={this.scrollToBottom}
        />
        {messages.map((message, index) => {
          if (message.userId === '#') {
            return message.chats.map((chat, index) => {
              if (chat.type === 'feed') return <CustomFeed text={chat.content} key={'f' + index} />;
              if (chat.type === 'wadiz-update')
                return <WadizUpdateFeed delta={chat.delta} key={'f' + index} />;
              if (chat.type === 'chat-clear')
                return <CustomFeed text={'채팅을 클리어 했습니다'} key={'f' + index} />;
            });
          }

          return (
            <ChatSet
              key={'c' + index}
              role={message.role}
              nickname={message.nickname}
              profileImageUrl={message.profileImageUrl}
              chats={message.chats}
              emoticons={this.props.emoticons}
            />
          );
        })}
      </Layout>
    );
  }
}
