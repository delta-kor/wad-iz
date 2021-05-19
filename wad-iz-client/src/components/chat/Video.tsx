import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';

const Layout = styled.video`
  position: absolute;
  width: 100%;
  height: calc(100vw * (9 / 16));
  max-height: 280px;
  top: 76px;
  background: ${Color.ULTRA_BLACK};

  @media (max-height: 560px) {
    opacity: 0;
  }
`;

const PcLayout = styled.video`
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  width: calc(100% - 414px);
  background: ${Color.ULTRA_BLACK};
`;

interface Props {
  isPc: boolean;
  videoState: VideoState;
  timeDelta: number;
}

export default class Video extends Component<Props, any> {
  video!: HTMLVideoElement;

  componentDidUpdate = (props: Props) => {
    if (this.props.videoState !== props.videoState) {
      this.video.src = this.props.videoState.id as string;
    }
  };

  onLoad = (ref: HTMLVideoElement) => {
    if (!ref) return false;
    this.video = ref;
    this.loadEventListeners();
    this.video.src = this.props.videoState.id as string;
  };

  loadEventListeners = () => {
    this.video.addEventListener('contextmenu', e => {
      e.preventDefault();
    });

    this.video.addEventListener('loadeddata', () => {
      this.video.play();
    });

    this.video.addEventListener('timeupdate', () => {
      const playStartTime = this.props.videoState.time! + this.props.timeDelta;
      let playTime = new Date().getTime() - playStartTime;

      const time = playTime / 1000;
      const videoTime = this.video.currentTime;

      const delta = Math.abs(videoTime - time);

      if (delta > 1) {
        this.video.currentTime = playTime / 1000;
      }
    });
  };

  render() {
    return this.props.isPc ? <PcLayout ref={this.onLoad} /> : <Layout ref={this.onLoad} />;
  }
}
