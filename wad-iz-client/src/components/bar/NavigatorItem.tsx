import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';

const Layout = styled(motion.div)`
  position: relative;
  width: 56px;
  height: 56px;
  cursor: pointer;
`;

const ActiveLayout = styled(motion.div)`
  position: relative;
  width: 56px;
  height: 56px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 100px;
  cursor: pointer;
`;

const Icon = styled.img<any>`
  position: absolute;
  width: 28px;
  height: 28px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: ${({ active }) => (active ? 'brightness(0) invert(1)' : 'none')};
`;

interface Props {
  active: boolean;
  src: string;
  onClick: () => void;
}

export default class NavigatorItem extends Component<Props, any> {
  render() {
    const content = <Icon src={this.props.src} active={this.props.active} />;
    if (this.props.active) {
      return (
        <ActiveLayout onClick={this.props.onClick} layoutId={'active-nav'}>
          {content}
        </ActiveLayout>
      );
    } else {
      return (
        <Layout
          onClick={this.props.onClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {content}
        </Layout>
      );
    }
  }
}
