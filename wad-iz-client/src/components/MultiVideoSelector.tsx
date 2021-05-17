import { motion } from 'framer-motion';
import { Component, MouseEvent } from 'react';
import styled from 'styled-components';
import ExpandIcon from '../icon/multi-expand.svg';
import { Color } from '../styles/color';
import { Shadow } from '../styles/shadow';

const Layout = styled(motion.div)`
  position: fixed;
  display: flex;
  right: 16px;
  top: calc(min(280px, (100vw * (9 / 16))) + 76px + 8px);
  height: 38px;
  padding: 0 16px;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 32px 32px;
  gap: 0 16px;
  justify-content: center;
  align-items: center;
  user-select: none;
  overflow-y: scroll;
`;

const Text = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  text-align: center;
  line-height: 14px;
  color: ${Color.WHITE};
  white-space: nowrap;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  left: 6px;
`;

const Item = styled.div<any>`
  text-align: center;
  font-style: normal;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  font-size: 12px;
  line-height: 17px;
  color: ${Color.WHITE};
  white-space: nowrap;
`;

interface Props {
  active: boolean;
  name: string[];
  selected: number;
  onSelect(index: number): void;
}

interface State {
  expanded: boolean;
}

export default class MultiVideoSelector extends Component<Props, State> {
  state = {
    expanded: false,
  };

  onPanelClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (!this.state.expanded) {
      window.addEventListener('click', this.closeMenu, { once: true });
    }
    this.setState({ expanded: !this.state.expanded });
  };

  closeMenu = () => {
    this.setState({ expanded: false });
  };

  componentWillUnmount = () => {
    window.removeEventListener('click', this.closeMenu);
  };

  render() {
    return (
      <Layout
        initial={'inactive'}
        variants={{
          inactive: { opacity: 0 },
          active: { opacity: 1, width: 130 },
          expand: {
            left: 16,
            right: 16,
            opacity: 1,
            width: 'calc(100vw - 32px)',
            justifyContent: 'left',
          },
        }}
        animate={this.props.active ? (this.state.expanded ? 'expand' : 'active') : 'inactive'}
        onClick={this.onPanelClick}
      >
        {!this.state.expanded ? (
          <>
            <Text>멤버별 영상</Text>
            <Icon src={ExpandIcon} />
          </>
        ) : (
          this.props.name.map((name, index) => (
            <Item
              key={index}
              bold={index === this.props.selected}
              onClick={() => this.props.onSelect(index)}
            >
              {name}
            </Item>
          ))
        )}
      </Layout>
    );
  }
}
