import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import BackIcon from '../../icon/back.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';

const Layout = styled(motion.div)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 76px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
`;

const Back = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 32px;
  top: calc(50% - 24px / 2);
  cursor: pointer;
`;

const Title = styled.div`
  position: absolute;
  height: 18px;
  left: 0px;
  right: 0px;
  top: calc(50% - 18px / 2);
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLACK};
`;

const Viewers = styled.div`
  position: absolute;
  width: 32px;
  height: 14px;
  right: 52px;
  top: calc(50% - 14px / 2);
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
  text-align: right;
  color: ${Color.BLUE};
`;

const ViewersIndicator = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  right: 34px;
  top: calc(50% - 8px / 2);
  background: ${Color.BLUE};
  box-shadow: ${Shadow.BLUE};
  border-radius: 6px;
`;

interface Props {
  title: string;
  viewers: number;
  onBack(): void;
}

export default class ChatTop extends Component<Props, any> {
  render() {
    return (
      <Layout initial={{ top: -76 }} animate={{ top: 0 }} transition={{ delay: 0.2 }}>
        <Title>{this.props.title}</Title>
        <Viewers>{this.props.viewers}</Viewers>
        <ViewersIndicator />
        <Back src={BackIcon} onClick={this.props.onBack} />
      </Layout>
    );
  }
}
