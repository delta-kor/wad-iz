import React, { Component } from 'react';
import styled from 'styled-components';
import HeartIcon from '../../icon/heart.svg';
import LeftArrowIcon from '../../icon/image-arrow-left.svg';
import RightArrowIcon from '../../icon/image-arrow-right.svg';
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
`;

const Image = styled.div<any>`
  position: relative;
  display: block;
  width: 100%;
  background: url(${({ src }) => src});
  background-size: contain;
  object-fit: cover;
`;

const CarouselButton = styled.div<any>`
  position: absolute;
  width: 32px;
  height: 32px;
  top: 50%;
  ${({ position }) => (position === 'left' ? 'left: 16px' : 'right: 16px')};
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  cursor: pointer;
  user-select: none;
`;

const CarouselIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
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

interface State {
  index: number;
}

export default class InstagramPostCard extends Component<Props, State> {
  imageRef = React.createRef<HTMLDivElement>();

  state = {
    index: 0,
  };

  componentDidMount = () => {
    this.resizeImage();
    window.addEventListener('resize', this.resizeImage);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.resizeImage);
  };

  resizeImage = () => {
    const element = this.imageRef.current!;
    const width = element.clientWidth;
    const ratio = this.props.post.height / this.props.post.width;
    const height = width * ratio;
    element.style.height = `${height}px`;
  };

  onArrowClick = (type: string): void => {
    let newIndex: number = this.state.index;
    const photosLength = this.props.post.photos.length;
    if (type === 'right') {
      if (this.state.index === photosLength - 1) {
        newIndex = 0;
      } else {
        newIndex++;
      }
    } else {
      if (this.state.index === 0) {
        newIndex = photosLength - 1;
      } else {
        newIndex--;
      }
    }
    this.setState({ index: newIndex });
  };

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
        <Image
          src={Transform.imageProxy(this.props.post.photos[this.state.index])}
          ref={this.imageRef}
        >
          {this.props.post.photos.length !== 1 && (
            <>
              <CarouselButton position={'left'} onClick={() => this.onArrowClick('left')}>
                <CarouselIcon src={LeftArrowIcon} />
              </CarouselButton>
              <CarouselButton position={'right'}>
                <CarouselIcon src={RightArrowIcon} onClick={() => this.onArrowClick('right')} />
              </CarouselButton>
            </>
          )}
        </Image>
        {this.props.post.content && (
          <Content width={this.props.width}>{this.props.post.content}</Content>
        )}
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
