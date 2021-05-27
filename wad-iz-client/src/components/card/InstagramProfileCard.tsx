import { Component } from 'react';
import styled from 'styled-components';
import PhotoIcon from '../../icon/photo.svg';
import StarIcon from '../../icon/star.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled.div`
  position: relative;
  height: 248px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;
`;

const ProfileImage = styled.img`
  position: absolute;
  width: 64px;
  height: 64px;
  left: calc(50% - 64px / 2);
  top: 32px;
  border-radius: 64px;
`;

const Username = styled.div`
  position: absolute;
  height: 24px;
  left: 32px;
  right: 32px;
  top: 112px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLACK};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MemberName = styled.div`
  position: absolute;
  height: 24px;
  left: 32px;
  right: 32px;
  top: 144px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLACK};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetaWrapper = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  bottom: 32px;
  height: 24px;
  justify-content: center;
  gap: 0 24px;
`;

const MetaItem = styled.div`
  display: flex;
  height: 24px;
  gap: 0 12px;
`;

const MetaIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const MetaValue = styled.div`
  height: 24px;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${Color.BLUE};
`;

interface Props {
  profile: InstagramProfile;
}

export default class InstagramProfileCard extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <ProfileImage src={Transform.imageProxy(this.props.profile.profile_image)} />
        <Username>@{this.props.profile.username}</Username>
        <MemberName>{this.props.profile.bio || this.props.profile.member_name}</MemberName>
        <MetaWrapper>
          <MetaItem>
            <MetaIcon src={PhotoIcon} />
            <MetaValue>{Transform.addComma(this.props.profile.photos)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaIcon src={StarIcon} />
            <MetaValue>{Transform.addComma(this.props.profile.followers)}</MetaValue>
          </MetaItem>
        </MetaWrapper>
      </Layout>
    );
  }
}
