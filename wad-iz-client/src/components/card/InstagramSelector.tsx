import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import { Transform } from '../../utils/transform';

const Layout = styled.div<any>`
  position: relative;
  width: ${({ width }) => width || '100%'};
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

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
`;

const ProfileImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 100px;
`;

const ProfileImageBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
  border-radius: 100px;
  box-shadow: inset 0 0 0 4px ${Color.BLUE};
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
  width?: string;
}

export default class InstagramSelectorCard extends Component<Props, any> {
  render() {
    return (
      <Layout width={this.props.width}>
        <Title>프로필</Title>
        <ProfileItemWrapper>
          {this.props.profiles.map((profile, index) => (
            <ProfileItem key={profile.username} onClick={() => this.props.onSelect(index)}>
              <ProfileImageWrapper>
                <ProfileImage src={Transform.imageProxy(profile.profile_image)} />
                {index === this.props.selected && <ProfileImageBorder />}
              </ProfileImageWrapper>
              <Username selected={index === this.props.selected}>{profile.member_name}</Username>
            </ProfileItem>
          ))}
        </ProfileItemWrapper>
      </Layout>
    );
  }
}
