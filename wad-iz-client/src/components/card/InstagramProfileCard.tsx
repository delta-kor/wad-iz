import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled.div`
  position: relative;
  width: 100%;
  height: 174px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;
`;

const Title = styled.div`
  position: absolute;
  height: 18px;
  left: 32px;
  right: 32px;
  top: 32px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  color: ${Color.BLACK};
`;

const ProfileItemWrapper = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  top: 74px;
  bottom: 32px;
  padding: 0 32px;
  gap: 0 16px;
  overflow-x: scroll;
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px 0;
  width: 48px;
  height: 68px;
`;

const ProfileImage = styled.img<any>`
  width: 48px;
  height: 48px;
  border-radius: 100%;
  border: ${({ selected }) => (selected ? `3px solid ${Color.BLUE}` : 'none')};
`;

const Username = styled.div<any>`
  font-style: normal;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  color: ${Color.BLACK};
`;

interface Props {
  profiles: InstagramProfile[];
  selected: number;
  onSelect(index: number): void;
}

export default class InstagramProfileCard extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <Title>프로필</Title>
        <ProfileItemWrapper>
          {this.props.profiles.map((profile, index) => (
            <ProfileItem key={profile.username} onClick={() => this.props.onSelect(index)}>
              <ProfileImage
                src={Transform.imageProxy(profile.profile_image)}
                selected={index === this.props.selected}
              />
              <Username selected={index === this.props.selected}>{profile.member_name}</Username>
            </ProfileItem>
          ))}
        </ProfileItemWrapper>
      </Layout>
    );
  }
}
