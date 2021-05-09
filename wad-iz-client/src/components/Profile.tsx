import { Component } from 'react';
import styled from 'styled-components';
import LeftIcon from '../icon/arrow-left.svg';
import RightIcon from '../icon/arrow-right.svg';
import EditIcon from '../icon/edit.svg';
import { Color } from '../styles/color';
import { Shadow } from '../styles/shadow';

const Layout = styled.div`
  position: relative;
  height: 276px;
`;

const ProfileImage = styled.img`
  position: absolute;
  width: 144px;
  height: 144px;
  left: calc(50% - 144px / 2);
  top: calc(50% - 144px / 2 - 42px);
  box-shadow: ${Shadow.DOWN};
  border-radius: 100px;
`;

const LeftIconButton = styled.img`
  position: absolute;
  width: 36px;
  height: 36px;
  left: calc(50% - 36px / 2 - 114px);
  top: calc(50% - 36px / 2 - 42px);
  cursor: pointer;
  user-select: none;
`;

const RightIconButton = styled.img`
  position: absolute;
  width: 36px;
  height: 36px;
  left: calc(50% - 36px / 2 + 114px);
  top: calc(50% - 36px / 2 - 42px);
  cursor: pointer;
  user-select: none;
`;

const NicknameWrapper = styled.div`
  position: absolute;
  display: flex;
  height: 48px;
  left: 0;
  right: 0;
  top: calc(50% - 48px / 2 + 90px);
  justify-content: center;
  align-items: center;
  gap: 0 16px;
`;

const Nickname = styled.div`
  height: 48px;
  font-family: Noto Sans KR;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 48px;
  text-align: center;
  color: ${Color.BLACK};
`;

const NicknameEditButton = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  user-select: none;
`;

interface Props {
  nickname: string;
  profileImageUrl: string;
}

export default class Profile extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <ProfileImage src={this.props.profileImageUrl} />
        <LeftIconButton src={LeftIcon} />
        <RightIconButton src={RightIcon} />
        <NicknameWrapper>
          <Nickname>{this.props.nickname}</Nickname>
          <NicknameEditButton src={EditIcon} />
        </NicknameWrapper>
      </Layout>
    );
  }
}
