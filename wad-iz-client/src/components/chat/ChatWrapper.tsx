import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { ChatMessage } from '../../App';
import { Transform } from '../../utils/transform';
import ChatPopup from './ChatPopup';
import ChatSet from './ChatSet';
import WadizUpdateFeed from './WadizUpdateFeed';

const Layout = styled(motion.div)<any>`
  position: absolute;
  display: flex;
  bottom: 76px;
  padding: 24px ${({ isPc }) => (isPc ? '56px' : '32px')};
  width: 100%;
  height: calc(100% - 76px - 76px);
  flex-direction: column;
  justify-content: left;
  gap: 24px 0;
  overflow-y: scroll;
`;

interface MessageItem {
  userId: string;
  nickname: string;
  profileImageUrl: string;
  chats: Chat[];
}

interface Props {
  isPc: boolean;
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
    if (this.state.locked) {
      this.layoutRef.scrollTop = this.layoutRef.scrollHeight;
    }
  }

  componentDidMount() {
    this.layoutRef.addEventListener('scroll', () => {
      const delta =
        this.layoutRef.scrollHeight - this.layoutRef.scrollTop - this.layoutRef.clientHeight;
      this.setState({ locked: delta === 0 });
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        ref={(ref: HTMLDivElement) => (this.layoutRef = ref)}
      >
        <ChatPopup
          content={lastContent}
          isPc={this.props.isPc}
          active={!this.state.locked}
          onClick={this.scrollToBottom}
        />
        {messages.map((message, index) => {
          if (message.userId === '#') {
            return message.chats.map(
              chat => chat.type === 'wadiz-update' && <WadizUpdateFeed delta={chat.delta} />
            );
          }

          return (
            <ChatSet
              key={index}
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
