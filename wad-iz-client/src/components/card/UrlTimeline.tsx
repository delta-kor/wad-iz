import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import UrlIcon from '../../icon/url.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';

const Layout = styled(motion.div)<any>`
  display: flex;
  width: ${({ isPc }) => (isPc ? '342px' : 'unset')};
  padding: 32px;
  flex-direction: column;
  gap: 16px 0;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Type = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  color: ${Color.BLACK};
`;

const Date = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  color: ${Color.BLUE};
`;

const Content = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 8px;
  text-decoration: none;
  user-select: none;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px 0;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  color: ${Color.BLUE};
`;

const Description = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: ${Color.GRAY};
`;

interface Props {
  type: string;
  date: string;
  title: string;
  description: string;
  url: string;
  isPc: boolean;
  delay?: number;
}

export default class UrlTimeline extends Component<Props, any> {
  render() {
    return (
      <Layout
        isPc={this.props.isPc}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: this.props.delay || 0 }}
      >
        <Header>
          <Type>{this.props.type}</Type>
          <Date>{this.props.date}</Date>
        </Header>
        <Content href={this.props.url} target={'_blank'}>
          <TextWrapper>
            <Title>{this.props.title}</Title>
            <Description>{this.props.description}</Description>
          </TextWrapper>
          <Icon src={UrlIcon} />
        </Content>
      </Layout>
    );
  }
}
