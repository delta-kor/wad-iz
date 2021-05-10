import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Transform } from '../../utils/transform';

const Layout = styled.div<any>`
  height: 24px;
  left: 25px;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${({ delta }) => (delta < 0 ? Color.RED : Color.BLUE)};
`;

interface Props {
  delta: number;
}

export default class WadizUpdateFeed extends Component<Props, any> {
  render() {
    return (
      <Layout delta={this.props.delta}>
        (wadiz) {this.props.delta < 0 ? '' : '+'} {Transform.toCurrency(this.props.delta)}
      </Layout>
    );
  }
}
