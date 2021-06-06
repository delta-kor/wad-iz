import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';

const Layout = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 16px 0;
`;

const AlbumImage = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 16px;
  box-shadow: ${Shadow.DOWN};
`;

const MusicTitle = styled.div`
  width: 100%;
  margin: 16px 0 0 0;
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

const MusicSubtitle = styled.div`
  width: 100%;
  margin: -4px 0 0 0;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
  color: ${Color.BLACK};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AlbumTitle = styled.div`
  width: 100%;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLUE};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface Props {
  radio: ActiveRadioState;
}

export default class RadioPc extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <Content>
          <AlbumImage src={this.props.radio.music.album.imageUrl} />
          <MusicTitle>{this.props.radio.music.title}</MusicTitle>
          {this.props.radio.music.subtitle && (
            <MusicSubtitle>{this.props.radio.music.subtitle}</MusicSubtitle>
          )}
          <AlbumTitle>{this.props.radio.music.album.title}</AlbumTitle>
        </Content>
      </Layout>
    );
  }
}
