import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled.div<any>`
  position: relative;
  width: 342px;
  height: 490px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;

  :nth-child(2n + 1) {
    order: 1;
  }
  :nth-child(2n) {
    order: 2;
  }
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
  flex-direction: column;
  left: 32px;
  right: 32px;
  top: 74px;
  bottom: 0;
  gap: 24px 0;
  overflow-y: scroll;
`;

const ProfileItem = styled.div`
  display: flex;
  gap: 0 24px;
  width: 100%;
  height: 56px;
  cursor: pointer;
  user-select: none;
`;

const ProfileImage = styled.img<any>`
  width: 56px;
  height: 56px;
  border-radius: 100%;
  border: ${({ selected }) => (selected ? `4px solid ${Color.BLUE}` : 'none')};
`;

const UserWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
`;

const Username = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: left;
  color: ${Color.BLACK};
`;

const MemberName = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  text-align: left;
  color: ${Color.BLACK};
`;

interface Props {
  profiles: InstagramProfile[];
  selected: number;
  onSelect(index: number): void;
}

export default class InstagramSelectorPcCard extends Component<Props, any> {
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
              <UserWrapper>
                <Username>@{profile.username}</Username>
                <MemberName>{profile.member_name}</MemberName>
              </UserWrapper>
            </ProfileItem>
          ))}
        </ProfileItemWrapper>
      </Layout>
    );
  }
}
