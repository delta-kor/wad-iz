import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import EmoticonIcon from '../../icon/emoticon.svg';
import SendIcon from '../../icon/send.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';

const Layout = styled(motion.div)`
  position: absolute;
  width: 100%;
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
  top: calc(50% - 24px / 2);
  cursor: pointer;
  user-select: none;
`;

const Input = styled.input`
  position: absolute;
  display: block;
  height: 46px;
  width: calc(100% - 74px - 88px);
  left: 74px;
  top: calc(50% - 46px / 2);
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
  top: calc(50% - 24px / 2);
  cursor: pointer;
  user-select: none;
`;

interface Props {
  placeholder: string;
}

export default class ChatInputer extends Component<Props, any> {
  static defaultProps = {
    placeholder: '채팅을 입력해주세요',
  };

  render() {
    return (
      <Layout initial={{ bottom: -76 }} animate={{ bottom: 0 }} transition={{ delay: 0.2 }}>
        <Emoticon src={EmoticonIcon} />
        <Input placeholder={this.props.placeholder} />
        <Send src={SendIcon} />
      </Layout>
    );
  }
}
