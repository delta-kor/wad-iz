import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import BottomIcon from '../../icon/bottom.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';

const Layout = styled(motion.div)<any>`
  position: fixed;
  left: ${({ isPc, isVideo }) =>
    isPc ? (isVideo ? 'calc(100% - 414px + 16px)' : '496px') : '16px'};
  right: 16px;
  bottom: 92px;
  height: 48px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
`;

const Text = styled.div`
  position: absolute;
  height: 14px;
  left: 24px;
  right: 64px;
  top: calc(50% - 14px / 2);
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  color: ${Color.WHITE};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Bottom = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  right: 24px;
  top: calc(50% - 24px / 2);
`;

interface Props {
  isPc: boolean;
  isVideo: boolean;
  content: string;
  active: boolean;
  onClick(): void;
}

export default class ChatPopup extends Component<Props, any> {
  render() {
    return (
      <Layout
        isPc={this.props.isPc}
        isVideo={this.props.isVideo}
        variants={{ active: { bottom: 92 }, inactive: { bottom: -48 } }}
        initial={'inactive'}
        animate={this.props.active ? 'active' : 'inactive'}
        onClick={this.props.onClick}
      >
        <Text>{this.props.content}</Text>
        <Bottom src={BottomIcon} />
      </Layout>
    );
  }
}
