import { Component } from 'react';
import styled from 'styled-components';
import HeartIcon from '../../icon/heart.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled.div<any>`
  width: ${({ width }) => width || '100%'};
  padding: 0 0 16px 0;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;
  overflow: hidden;

  ${({ width }) =>
    width &&
    `
  :nth-child(2n + 1) {
    order: 1;
  }
  :nth-child(2n) {
    order: 2;
  }`}
`;

const Image = styled.img<any>`
  display: block;
  width: 100%;
  height: ${({ width }) => (width ? '280px' : 'auto')};
  object-fit: cover;
`;

const Content = styled.div<any>`
  display: inline-block;
  width: calc(min(${({ width }) => (width ? width : '100vw')} - 72px, 580px - 72px));
  overflow-wrap: break-word;
  margin: 16px 0 0 0;
  padding: 0 32px;
  font-family: Noto Sans KR;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const MetaWrapper = styled.div`
  display: flex;
  margin: 12px 0 0 0;
  padding: 0 32px;
  height: 24px;
  justify-content: space-between;
`;

const Timestamp = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  color: ${Color.BLUE};
`;

const LikeWrapper = styled.div`
  display: flex;
  gap: 0 8px;
  align-items: center;
`;

const LikeIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const LikeValue = styled.div`
  font-family: Product Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: ${Color.BLUE};
`;

interface Props {
  post: InstagramPost;
  width?: string;
}

export default class InstagramPostCard extends Component<Props, any> {
  render() {
    let timestamp = Math.round(this.props.post.timestamp / 1000);
    if (timestamp.toString().length === 12) {
      timestamp = timestamp * 10;
    }
    if (timestamp.toString().length === 11) {
      timestamp = timestamp * 100;
    }
    return (
      <Layout width={this.props.width}>
        <Image src={Transform.imageProxy(this.props.post.photos[0])} width={this.props.width} />
        <Content width={this.props.width}>{this.props.post.content}</Content>
        <MetaWrapper>
          <Timestamp>
            {Transform.toTimeHistoryText((new Date().getTime() - timestamp) / 1000)}
          </Timestamp>
          <LikeWrapper>
            <LikeIcon src={HeartIcon} />
            <LikeValue>{Transform.addComma(this.props.post.likes)}</LikeValue>
          </LikeWrapper>
        </MetaWrapper>
      </Layout>
    );
  }
}
