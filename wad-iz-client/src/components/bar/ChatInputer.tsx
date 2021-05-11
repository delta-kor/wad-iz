import { motion } from 'framer-motion';
import { ChangeEvent, Component, KeyboardEvent } from 'react';
import styled from 'styled-components';
import EmoticonIcon from '../../icon/emoticon.svg';
import SendIcon from '../../icon/send.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';

const Layout = styled(motion.div)<any>`
  position: fixed;
  width: ${({ isPc, isVideo }) => (isPc ? (isVideo ? '414px' : 'calc(100% - 480px)') : '100%')};
  bottom: 0;
  height: 76px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.UP};
`;

const Emoticon = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 32px;
  top: 26px;
  cursor: pointer;
  user-select: none;
`;

const Input = styled.input`
  position: absolute;
  display: block;
  height: 46px;
  width: calc(100% - 74px - 88px);
  left: 74px;
  top: 15px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 46px;
  color: ${Color.BLACK};
  border: none;

  ::placeholder {
    color: ${Color.GRAY};
  }
`;

const Send = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  right: 32px;
  top: 26px;
  cursor: pointer;
  user-select: none;
`;

const EmoticonWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 74px;
  bottom: 24px;
  display: flex;
  padding: 0 32px;
  gap: 0 12px;
  overflow-y: scroll;
`;

const EmoticonItem = styled.img`
  width: 80px;
  height: 80px;
  cursor: pointer;
  user-select: none;

  :last-of-type {
    padding: 0 32px 0 0;
    width: 112px;
  }
`;

interface Props {
  placeholder: string;
  onTextSend(value: string): void;
  isPc: boolean;
  isVideo?: boolean;
  emoticons: Map<string, string>;
}

interface State {
  value: string;
  emoticon: boolean;
}

export default class ChatInputer extends Component<Props, State> {
  wrapper!: HTMLDivElement;

  state = {
    value: '',
    emoticon: false,
  };

  static defaultProps = {
    placeholder: '채팅을 입력해주세요',
  };

  onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value, emoticon: false });
  };

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') this.onSubmit();
  };

  onSubmit = () => {
    this.props.onTextSend(this.state.value);
    this.setState({ value: '', emoticon: false });
  };

  onEmoticonClick = () => {
    if (!this.state.emoticon) this.wrapper.scrollLeft = 0;
    this.setState({ emoticon: !this.state.emoticon });
  };

  onEmoticonItemClick = (key: string) => {
    this.setState({ emoticon: false });
    this.props.onTextSend(key);
  };

  wrapperRef = (element: HTMLDivElement) => {
    if (!element) return false;
    this.wrapper = element;
    element.addEventListener('wheel', e => {
      if (e.deltaY > 0) element.scrollLeft += 50;
      else element.scrollLeft -= 50;
    });
  };

  render() {
    const emoticonItems = [];
    for (const emoticon of this.props.emoticons.entries()) {
      emoticonItems.push(
        <EmoticonItem
          src={emoticon[1]}
          key={emoticon[0]}
          onClick={() => this.onEmoticonItemClick(emoticon[0])}
        />
      );
    }

    return (
      <Layout
        isPc={this.props.isPc}
        isVideo={this.props.isVideo}
        variants={{
          inactive: { bottom: -76 },
          active: { bottom: 0 },
          emoticon: { height: 178, bottom: 0 },
        }}
        initial={'inactive'}
        animate={this.state.emoticon ? 'emoticon' : 'active'}
        transition={{ delay: 0.2 }}
      >
        <Emoticon src={EmoticonIcon} onClick={this.onEmoticonClick} />
        <Input
          placeholder={this.props.placeholder}
          onChange={this.onInputChange}
          value={this.state.value}
          onKeyDown={this.onKeyDown}
        />
        <Send src={SendIcon} onClick={this.onSubmit} />
        <EmoticonWrapper ref={this.wrapperRef}>{emoticonItems}</EmoticonWrapper>
      </Layout>
    );
  }
}
