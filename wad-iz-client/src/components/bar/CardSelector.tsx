import { Component } from 'react';
import styled from 'styled-components';
import DashboardIcon from '../../icon/dashboard.svg';
import InstagramIcon from '../../icon/instagram.svg';
import TimelineIcon from '../../icon/timeline.svg';
import { Color } from '../../styles/color';

const Layout = styled.div<any>`
  display: flex;
  height: ${({ isPc }) => (isPc ? '56px' : '42px')};
  margin: ${({ isPc }) => (isPc ? '0' : '0 0 -8px 0')};
  gap: 0 ${({ isPc }) => (isPc ? '32px' : '18px')};
  z-index: 2;
`;

const Item = styled.div<any>`
  position: relative;
  width: ${({ isPc }) => (isPc ? '56px' : '42px')};
  height: ${({ isPc }) => (isPc ? '56px' : '42px')};
  border-radius: 100%;
  background: ${({ isPc }) => (isPc ? Color.WHITE : Color.BLUE_BRIGHT)};
  overflow: hidden;
  cursor: pointer;
  user-select: none;
`;

const ItemHighlight = styled.div<any>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({ selected }) => (!selected ? '0' : '100%')};
  height: ${({ selected }) => (!selected ? '0' : '100%')};
  background: ${({ isPc }) => (isPc ? Color.BLUE : Color.WHITE)};
  border-radius: 100%;
  transition: width 500ms, height 500ms;
`;

const ItemIcon = styled.img<any>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({ isPc }) => (isPc ? '24px' : '18px')};
  height: ${({ isPc }) => (isPc ? '24px' : '18px')};
  filter: ${({ selected, isPc }) =>
    isPc
      ? !selected
        ? 'none'
        : 'brightness(0) invert(1)'
      : selected
      ? 'none'
      : 'brightness(0) invert(1)'};
  transition: filter 500ms;
`;

interface Props {
  isPc: boolean;
  selected: number;
  onChange(menu: number): void;
}

export default class CardSelector extends Component<Props, any> {
  render() {
    return (
      <Layout isPc={this.props.isPc}>
        <Item
          isPc={this.props.isPc}
          onClick={() => this.props.onChange(0)}
          selected={this.props.selected === 0}
        >
          <ItemHighlight selected={this.props.selected === 0} isPc={this.props.isPc} />
          <ItemIcon
            src={DashboardIcon}
            selected={this.props.selected === 0}
            isPc={this.props.isPc}
          />
        </Item>
        <Item
          isPc={this.props.isPc}
          onClick={() => this.props.onChange(1)}
          selected={this.props.selected === 1}
        >
          <ItemHighlight selected={this.props.selected === 1} isPc={this.props.isPc} />
          <ItemIcon
            src={InstagramIcon}
            selected={this.props.selected === 1}
            isPc={this.props.isPc}
          />
        </Item>
        <Item
          isPc={this.props.isPc}
          onClick={() => this.props.onChange(2)}
          selected={this.props.selected === 2}
        >
          <ItemHighlight selected={this.props.selected === 2} isPc={this.props.isPc} />
          <ItemIcon
            src={TimelineIcon}
            selected={this.props.selected === 2}
            isPc={this.props.isPc}
          />
        </Item>
      </Layout>
    );
  }
}
