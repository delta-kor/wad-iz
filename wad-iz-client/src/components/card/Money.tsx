import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled(motion.div)<any>`
  position: relative;
  height: 150px;
  background: ${Color.WHITE};
  box-shadow: ${props => (props.noShadow ? 'none' : Shadow.DOWN)};
  border-radius: 16px;
  z-index: 2;
`;

const Title = styled.div`
  position: absolute;
  height: 18px;
  left: 32px;
  width: 64px;
  top: 32px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const Label = styled.div`
  position: absolute;
  height: 18px;
  left: 96px;
  right: 32px;
  top: 32px;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  text-align: right;
  color: ${Color.BLUE};
`;

const Amount = styled.div`
  position: absolute;
  height: 24px;
  left: 32px;
  right: 32px;
  top: 66px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const Description = styled.div`
  position: absolute;
  height: 18px;
  left: 32px;
  right: 32px;
  top: 100px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  color: ${Color.GRAY};
`;

interface Props {
  title: string;
  label: string;
  amount: number;
  noShadow?: boolean;
  delay?: number;
}

export default class MoneyCard extends Component<Props, any> {
  render() {
    return (
      <Layout
        noShadow={this.props.noShadow}
        initial={{ zoom: 0.5, opacity: 0 }}
        animate={{ zoom: 1, opacity: 1 }}
        transition={{ delay: this.props.delay || 0 }}
      >
        <Title>{this.props.title}</Title>
        <Label>{this.props.label}</Label>
        <Amount>{Transform.toCurrency(this.props.amount)}</Amount>
        <Description>{Transform.toCurrencyLocaleNumber(this.props.amount)}</Description>
      </Layout>
    );
  }
}
