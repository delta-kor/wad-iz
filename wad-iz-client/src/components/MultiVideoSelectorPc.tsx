import { motion } from 'framer-motion';
import { Component, MouseEvent } from 'react';
import styled from 'styled-components';
import ExpandIcon from '../icon/multi-expand.svg';
import { Color } from '../styles/color';
import { Shadow } from '../styles/shadow';

const Layout = styled(motion.div)`
  position: fixed;
  display: flex;
  width: 28px;
  right: 386px;
  top: calc(50% - 158px / 2);
  padding: 16px 0;
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 0px 8px 8px 0px;
  flex-direction: column;
  justify-content: center;
  gap: 8px 0;
  align-items: center;
  user-select: none;
`;

const Text = styled.div`
  width: 10px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  line-height: 14px;
  color: ${Color.WHITE};
  writing-mode: vertical-rl;
  text-orientation: upright;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
  left: 6px;
  cursor: pointer;
`;

const Item = styled.div<any>`
  width: 100%;
  text-align: center;
  font-style: normal;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  font-size: 14px;
  line-height: 17px;
  color: ${Color.WHITE};
  cursor: pointer;
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

export default class MultiVideoSelectorPc extends Component<Props, State> {
  state = {
    expanded: false,
  };

  onPanelClick = (e: MouseEvent) => {
    e.stopPropagation();
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
          inactive: { right: 386 + 32 },
          active: { right: 386 },
          expand: { width: 80, right: 386 - (80 - 28) },
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
