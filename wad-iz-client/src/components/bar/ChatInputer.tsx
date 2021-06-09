import { motion } from 'framer-motion';
import { ChangeEvent, Component, KeyboardEvent } from 'react';
import styled from 'styled-components';
import EmoticonIcon from '../../icon/emoticon.svg';
import SendIcon from '../../icon/send.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { getEmoticonsFromSet } from '../../utils/emoticon';
import playSfx from '../../utils/sfx';

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
  top: 114px;
  bottom: 24px;
  display: flex;
  padding: 0 32px;
  gap: 0 12px;
  overflow-x: scroll;
`;

const EmoticonItem = styled.img`
  width: 80px;
  height: 80px;
  cursor: pointer;
  user-select: none;
  background: ${Color.BACKGROUND};
`;

const EmoticonSetWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 78px;
  padding: 0 24px 0 32px;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
`;

const EmoticonSetItemActive = styled.div`
  display: inline-block;
  padding: 0 16px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
  color: ${Color.WHITE};
  background: ${Color.BLUE};
  border-radius: 100px;
  margin: 0 8px 0 0;
  user-select: none;
`;

const EmoticonSetItem = styled.div`
  display: inline-block;
  padding: 0 16px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
  color: ${Color.BLACK};
  background: ${Color.LIGHT_GRAY};
  border-radius: 100px;
  margin: 0 8px 0 0;
  user-select: none;
  cursor: pointer;
`;

interface Props {
  placeholder: string;
  onTextSend(value: string): void;
  isPc: boolean;
  isVideo?: boolean;
  emoticons: EmoticonSet[];
}

interface State {
  value: string;
  emoticon: boolean;
  set: string;
}

export default class ChatInputer extends Component<Props, State> {
  wrapper!: HTMLDivElement;
  setWrapper!: HTMLDivElement;

  state = {
    value: '',
    emoticon: false,
    set: this.props.emoticons[0]?.title,
  };

  static defaultProps = {
    placeholder: '채팅을 입력해주세요',
  };

  componentDidUpdate = (props: Props, state: State) => {
    if (this.state.set !== state.set) {
      this.wrapper.scrollLeft = 0;
    }
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
    playSfx(this.state.emoticon ? 'collapse' : 'expand');
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

  setWrapperRef = (element: HTMLDivElement) => {
    if (!element) return false;
    this.setWrapper = element;
    element.addEventListener('wheel', e => {
      if (e.deltaY > 0) element.scrollLeft += 50;
      else element.scrollLeft -= 50;
    });
  };

  onSetClick = (title: string) => {
    this.setState({ set: title });
  };

  render() {
    const emoticonItems = [];
    for (const emoticon of getEmoticonsFromSet(this.props.emoticons, this.state.set)) {
      emoticonItems.push(
        <EmoticonItem
          src={emoticon.url}
          key={emoticon.key}
          onClick={() => this.onEmoticonItemClick(emoticon.key)}
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
          emoticon: { height: 218, bottom: 0 },
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
        <EmoticonSetWrapper ref={this.setWrapperRef}>
          {this.props.emoticons.map(set => {
            return this.state.set === set.title ? (
              <EmoticonSetItemActive key={set.title}>{set.title}</EmoticonSetItemActive>
            ) : (
              <EmoticonSetItem onClick={() => this.onSetClick(set.title)} key={set.title}>
                {set.title}
              </EmoticonSetItem>
            );
          })}
        </EmoticonSetWrapper>
        <EmoticonWrapper ref={this.wrapperRef}>{emoticonItems}</EmoticonWrapper>
      </Layout>
    );
  }
}
