import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled(motion.div)<any>`
  position: relative;
  height: 126px;
  background: ${Color.BLUE};
  box-shadow: ${props => (props.noShadow ? 'none' : Shadow.BLUE)};
  border-radius: 16px;
  z-index: 2;
`;

const Amount = styled.div`
  position: absolute;
  height: 24px;
  left: 0px;
  right: 0px;
  top: 37px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  text-align: center;
  color: ${Color.WHITE};
`;

const Description = styled.div`
  position: absolute;
  height: 16px;
  left: 0px;
  right: 0px;
  top: 73px;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${Color.WHITE};
`;

interface Props {
  amount: number;
  noShadow?: boolean;
  delay?: number;
}

export default class TotalCard extends Component<Props, any> {
  render() {
    return (
      <Layout
        noShadow={this.props.noShadow}
        initial={{ zoom: 0.5, opacity: 0 }}
        animate={{ zoom: 1, opacity: 1 }}
        transition={{ delay: this.props.delay || 0 }}
      >
        <Amount>{Transform.toCurrency(this.props.amount)}</Amount>
        <Description>{Transform.toCurrencyLocaleNumber(this.props.amount)}</Description>
      </Layout>
    );
  }
}
