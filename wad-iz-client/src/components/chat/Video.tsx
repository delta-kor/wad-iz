import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';

const Layout = styled.div`
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

const PcLayout = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: calc(100% - 414px);
  background: ${Color.ULTRA_BLACK};
`;

const VideoElement = styled.video`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const Lyrics = styled.div`
  position: absolute;
  padding: 2px;
  bottom: calc((100% - (100vw - 414px) * (9 / 16)) / 2 + 64px);
  left: 64px;
  font-family: Noto Sans KR, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  color: ${Color.WHITE};
  text-shadow: ${Color.BLUE} 1px 1px, ${Color.BLUE} -1px 1px, ${Color.BLUE} 1px -1px,
    ${Color.BLUE} -1px -1px;

  @media screen and (max-width: 1024px) {
    left: 12px;
    bottom: 12px;
    font-size: 14px;
  }
`;

const LyricsHeader = styled.div`
  display: inline-block;
  padding: 2px 8px;
  margin: 0 0 4px 0;
  font-style: bold;
  font-weight: normal;
  font-size: 16px;
  color: ${Color.WHITE};
  background: ${Color.BLUE}a0;
  text-shadow: none;

  @media screen and (max-width: 1024px) {
    font-size: 12px;
  }
`;

interface Props {
  isPc: boolean;
  videoState: VideoState;
  timeDelta: number;
}

interface State {
  currentTime: number;
  displayLyrics: boolean;
  lyricsHeader: string;
  lyricsContent: string;
}

const isDev = window.location.hostname === 'localhost';

export default class Video extends Component<Props, State> {
  video!: HTMLVideoElement;
  interval: any;

  state = {
    currentTime: 0,
    displayLyrics: false,
    lyricsHeader: '',
    lyricsContent: '',
  };

  componentDidUpdate = (props: Props) => {
    if (this.props.videoState !== props.videoState) {
      this.video.src = this.props.videoState.id as string;
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  onLoad = (ref: HTMLVideoElement) => {
    if (!ref) return false;
    this.video = ref;
    this.loadEventListeners();
    this.video.src = this.props.videoState.id as string;
    this.video.controls = isDev;
  };

  loadEventListeners = () => {
    this.video.addEventListener('contextmenu', e => {
      e.preventDefault();
    });

    this.video.addEventListener('loadeddata', () => {
      this.video.play();
    });

    this.video.addEventListener('play', () => {
      const playStartTime = this.props.videoState.time! + this.props.timeDelta;
      let playTime = new Date().getTime() - playStartTime;

      const time = playTime / 1000;
      const videoTime = this.video.currentTime;

      const delta = Math.abs(videoTime - time);

      if (delta > 1 && !isDev) {
        this.video.currentTime = playTime / 1000;
      }
    });

    this.video.addEventListener('timeupdate', () => {
      this.setState({ currentTime: this.video.currentTime });

      const playStartTime = this.props.videoState.time! + this.props.timeDelta;
      let playTime = new Date().getTime() - playStartTime;

      const time = playTime / 1000;
      const videoTime = this.video.currentTime;

      const delta = Math.abs(videoTime - time);

      if (delta > 1 && !isDev) {
        this.video.currentTime = playTime / 1000;
      }
    });

    this.interval = setInterval(() => {
      if (!this.props.videoState.lyrics) {
        this.setState({ displayLyrics: false });
        return false;
      }
      const timestamps = Object.keys(this.props.videoState.lyrics).map(Number);
      const currentTime = this.video.currentTime * 1000;

      let target: number = timestamps.length - 1;

      for (const timestamp of timestamps) {
        if (currentTime < timestamp) {
          const index = timestamps.indexOf(timestamp);
          target = index - 1;
          break;
        }
      }

      const lyrics = this.props.videoState.lyrics[timestamps[target]];

      if (!lyrics || !lyrics[0]) {
        this.setState({ displayLyrics: false });
        return false;
      }

      this.setState({ displayLyrics: true, lyricsHeader: lyrics[0], lyricsContent: lyrics[1] });
    }, 100);
  };

  render() {
    const content = (
      <div>
        <VideoElement ref={this.onLoad} />
        {this.state.displayLyrics && (
          <Lyrics>
            <LyricsHeader>{this.state.lyricsHeader}</LyricsHeader>
            <br />
            {this.state.lyricsContent.split('\n').map((item, key) => (
              <span key={key}>
                {item}
                <br />
              </span>
            ))}
          </Lyrics>
        )}
      </div>
    );
    return this.props.isPc ? <PcLayout>{content}</PcLayout> : <Layout>{content}</Layout>;
  }
}
