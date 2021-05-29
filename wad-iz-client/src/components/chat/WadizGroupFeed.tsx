import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Transform } from '../../utils/transform';
import WadizUpdateFeed from './WadizUpdateFeed';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 56px;
  gap: 8px 0;
`;

const AmountWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 24px;
  gap: 0 16px;
`;

const UpAmount = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.RED};
`;

const DownAmount = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLUE};
`;

const Expand = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: ${Color.PURPLE};
  cursor: pointer;
  user-select: none;
`;

interface Props {
  feeds: WadizUpdateChat[];
}

interface State {
  expanded: boolean;
}

export default class WadizGroupFeed extends Component<Props, State> {
  state = {
    expanded: false,
  };

  onExpand = () => {
    this.setState({ expanded: true });
  };

  render() {
    let count: number = 0,
      up: number = 0,
      down: number = 0;
    for (const feed of this.props.feeds) {
      if (feed.delta === 0) continue;
      if (feed.delta > 0) up += feed.delta;
      if (feed.delta < 0) down -= feed.delta;
      count++;
    }

    if (!this.state.expanded)
      return (
        <Layout>
          <AmountWrapper>
            {up ? <UpAmount>{Transform.toCurrencyDelta(up)}</UpAmount> : ''}
            {down ? <DownAmount>{Transform.toCurrencyDelta(-down)}</DownAmount> : ''}
          </AmountWrapper>
          <Expand onClick={this.onExpand}>전체 보기 [{count}]</Expand>
        </Layout>
      );
    else {
      return this.props.feeds.map((feed, index) => (
        <WadizUpdateFeed delta={feed.delta} key={'f' + index} />
      ));
    }
  }
}
