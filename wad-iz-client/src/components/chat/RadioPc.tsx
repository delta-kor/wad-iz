import { motion } from 'framer-motion';
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
  gap: 64px 0;
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
  height: 18px;
  margin: -4px 0 0 0;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 18px;
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

const LyricsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 56px;
  flex-direction: column;
  align-items: center;
  gap: 8px 0;
`;

const LyricsHighlighted = styled(motion.div)`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLACK};
`;

const Lyrics = styled(motion.div)`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.GRAY};
`;

interface Props {
  radio: ActiveRadioState;
  timeDelta: number;
}

interface State {
  lyricsA: string | null;
  lyricsB: string | null;
}

const cdnUrl = 'https://i.iz-cdn.kro.kr/stream?id=';

export default class RadioPc extends Component<Props, State> {
  audio: HTMLAudioElement;
  interval: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      lyricsA: null,
      lyricsB: null,
    };
    this.audio = new Audio();
  }

  onLoad = () => {
    this.loadEventListeners();
    this.audio.src = cdnUrl + this.props.radio.music.id;
  };

  loadEventListeners = () => {
    this.audio.addEventListener('loadeddata', () => {
      this.audio.play();
    });

    this.audio.addEventListener('play', () => {
      const playStartTime = this.props.radio.time + this.props.timeDelta;
      let playTime = new Date().getTime() - playStartTime;

      const time = playTime / 1000;
      const videoTime = this.audio.currentTime;

      const delta = Math.abs(videoTime - time);

      if (delta > 1) {
        this.audio.currentTime = playTime / 1000;
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      const playStartTime = this.props.radio.time + this.props.timeDelta;
      let playTime = new Date().getTime() - playStartTime;

      const time = playTime / 1000;
      const videoTime = this.audio.currentTime;

      const delta = Math.abs(videoTime - time);

      if (delta > 1) {
        this.audio.currentTime = playTime / 1000;
      }
    });

    this.interval = setInterval(() => {
      if (!this.props.radio.music.lyrics) {
        return false;
      }

      const timestamps = Object.keys(this.props.radio.music.lyrics).map(Number);
      const currentTime = this.audio.currentTime * 1000;

      let target: number = timestamps.length - 1;

      if (currentTime < timestamps[0]) {
        const lyricsA = 'IZ*ONE - ' + this.props.radio.music.title;
        const lyricsB = this.props.radio.music.lyrics[timestamps[0]];

        this.setState({ lyricsA: lyricsA, lyricsB: lyricsB[0] });
      }

      for (const timestamp of timestamps) {
        if (currentTime < timestamp) {
          const index = timestamps.indexOf(timestamp);
          target = index - 1;
          break;
        }
      }

      const lyricsA = this.props.radio.music.lyrics[timestamps[target]];
      const lyricsB = this.props.radio.music.lyrics[timestamps[target + 1]];

      if (!lyricsA) {
        return false;
      }

      this.setState({ lyricsA: lyricsA[0], lyricsB: lyricsB ? lyricsB[0] : null });
    }, 100);
  };

  componentDidMount = () => {
    this.onLoad();
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
    this.audio.pause();
  };

  componentDidUpdate = (props: Props) => {
    if (this.props.radio !== props.radio) {
      this.audio.src = cdnUrl + this.props.radio.music.id;
      this.audio.load();
      this.setState({ lyricsA: null, lyricsB: null });
    }
  };

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
        {(this.state.lyricsA || this.state.lyricsB) && (
          <LyricsWrapper>
            <LyricsHighlighted>{this.state.lyricsA}</LyricsHighlighted>
            <Lyrics>{this.state.lyricsB}</Lyrics>
          </LyricsWrapper>
        )}
      </Layout>
    );
  }
}
