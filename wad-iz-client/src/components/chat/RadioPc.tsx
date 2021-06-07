import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import PauseIcon from '../../icon/pause.svg';
import PlayIcon from '../../icon/play.svg';
import RadioIcon from '../../icon/radio.svg';
import SoundHighIcon from '../../icon/sound-high.svg';
import SoundLowIcon from '../../icon/sound-low.svg';
import SoundMiddleIcon from '../../icon/sound-mid.svg';
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
  user-select: none;
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

const ButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  left: 50%;
  bottom: 128px;
  transform: translateX(-50%);
  align-items: center;
  justify-content: center;
  gap: 0 32px;
`;

const Button = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  background: ${Color.BACKGROUND};
  border-radius: 100px;
  cursor: pointer;
  user-select: none;
`;

const ButtonIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
`;

const RadioTitleWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 128px;
  left: 50%;
  transform: translateX(-50%);
  gap: 0 16px;
  align-items: flex-end;
  user-select: none;
`;

const RadioTitleIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const RadioTitleText = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  color: ${Color.GRAY};
`;

enum Volume {
  LOW,
  MIDDLE,
  HIGH,
}

interface Props {
  radio: ActiveRadioState;
  timeDelta: number;
}

interface State {
  playing: boolean;
  volume: Volume;
  lyricsA: string | null;
  lyricsB: string | null;
}

const cdnUrl = 'https://i.iz-cdn.kro.kr/stream?v2=';

export default class RadioPc extends Component<Props, State> {
  audio: HTMLAudioElement;
  interval: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      playing: true,
      volume: parseInt(localStorage.getItem('radio_volume')!) || Volume.HIGH,
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
      this.setState({ playing: true });

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

    this.audio.addEventListener('pause', () => {
      this.setState({ playing: false });
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

  componentDidUpdate = (props: Props, state: State) => {
    if (this.props.radio !== props.radio) {
      this.audio.src = cdnUrl + this.props.radio.music.id;
      this.audio.load();
      this.setState({ lyricsA: null, lyricsB: null });
    }

    if (this.state.playing !== state.playing) {
      if (this.state.playing) this.audio.play();
      else this.audio.pause();
    }

    if (this.state.volume !== state.volume) {
      if (this.state.volume === Volume.HIGH) this.audio.volume = 1;
      if (this.state.volume === Volume.MIDDLE) this.audio.volume = 0.5;
      if (this.state.volume === Volume.LOW) this.audio.volume = 0.2;
    }
  };

  onPlayClick = () => {
    this.setState({ playing: !this.state.playing });
  };

  onVolumeClick = () => {
    let volume = this.state.volume - 1;
    if (volume < 0) volume = Volume.HIGH;
    localStorage.setItem('radio_volume', volume.toString());
    this.setState({ volume });
  };

  render() {
    return (
      <Layout>
        <RadioTitleWrapper>
          <RadioTitleIcon src={RadioIcon} />
          <RadioTitleText>IZ*ONE RADIO</RadioTitleText>
        </RadioTitleWrapper>
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
        <ButtonWrapper>
          <Button onClick={this.onPlayClick}>
            <ButtonIcon src={this.state.playing ? PauseIcon : PlayIcon} />
          </Button>
          <Button onClick={this.onVolumeClick}>
            <ButtonIcon
              src={
                this.state.volume === Volume.HIGH
                  ? SoundHighIcon
                  : this.state.volume === Volume.MIDDLE
                  ? SoundMiddleIcon
                  : SoundLowIcon
              }
            />
          </Button>
        </ButtonWrapper>
      </Layout>
    );
  }
}
