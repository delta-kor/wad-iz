import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Transform } from '../../utils/transform';

const Layout = styled.div`
  display: flex;
  margin: 16px 0;
  flex-direction: column;
  gap: 8px 0;
`;

const ProfileContent = styled.div`
  height: 50px;
  display: flex;
  gap: 0 20px;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 100%;
`;

const FeedContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px 0;
`;

const Username = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const FeedText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const Button = styled.a`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  text-decoration: none;
  text-align: center;
  line-height: 24px;
  color: ${Color.BLUE};
  cursor: pointer;
  user-select: none;
`;

interface Props {
  type: 'photo' | 'story';
  username: string;
  profileImage: string;
  url: string;
}

export default class InstagramUpdateFeed extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <ProfileContent>
          <ProfileImage src={Transform.imageProxy(this.props.profileImage)} />
          <FeedContent>
            <Username>@{this.props.username}</Username>
            <FeedText>
              {this.props.type === 'photo'
                ? '게시물이 업데이트 되었습니다'
                : '스토리가 업데이트 되었습니다'}
            </FeedText>
          </FeedContent>
        </ProfileContent>
        <Button href={this.props.url} target={'_blank'}>
          {this.props.type === 'photo' ? '게시물 보기' : '스토리 보기'}
        </Button>
      </Layout>
    );
  }
}
