import { Component } from 'react';
import YoutubeContent from 'react-youtube';
import styled from 'styled-components';
import { Color } from '../../styles/color';

const Layout = styled(YoutubeContent)`
  position: absolute;
  width: 100%;
  height: calc(100vw * (9 / 16));
  max-height: 280px;
  top: 76px;

  @media (max-height: 560px) {
    opacity: 0;
  }
`;

const PcLayout = styled(YoutubeContent)`
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  width: calc(100% - 414px);
  background: ${Color.BLACK};
`;

interface Props {
  isPc: boolean;
  videoState: VideoState;
  timeDelta: number;
}

export default class Youtube extends Component<Props, any> {
  onLoad = (e: any) => {
    const youtube = e.target;
    const id =
      typeof this.props.videoState.id === 'string'
        ? this.props.videoState.id
        : this.props.videoState.id![0];
    youtube.loadVideoById(id);
    youtube.playVideo();
  };

  onChange = (e: any) => {
    const youtube = e.target;
    if (e.data === 1) {
      const playStartTime = this.props.videoState.time! + this.props.timeDelta;
      const playTime = new Date().getTime() - playStartTime;

      const time = playTime / 1000;
      const youtubeTime = youtube.getCurrentTime();
      const delta = Math.abs(youtubeTime - time);

      if (delta > 3 && !this.props.videoState.isLive) {
        youtube.seekTo(playTime / 1000);
      }
    }
  };

  render() {
    return this.props.isPc ? (
      <PcLayout onReady={this.onLoad} onStateChange={this.onChange} />
    ) : (
      <Layout onReady={this.onLoad} onStateChange={this.onChange} />
    );
  }
}
