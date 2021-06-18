import { motion } from 'framer-motion';
import { Component } from 'react';
import styled from 'styled-components';
import PauseIcon from '../../icon/pause.svg';
import PlayIcon from '../../icon/play.svg';
import SoundHighIcon from '../../icon/sound-high.svg';
import SoundLowIcon from '../../icon/sound-low.svg';
import SoundMiddleIcon from '../../icon/sound-mid.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import RadioVote from './RadioVote';

const Layout = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  height: calc(100vw * (9 / 16) + 26px);
  max-height: 280px;
  top: 50px;
  background: ${Color.WHITE};
  flex-direction: column;
  gap: 24px 0;
  align-items: center;
  justify-content: center;

  @media (max-height: 560px) {
    opacity: 0;
  }

  @media screen and (max-width: 360px) {
    gap: 16px 0;
    * {
      zoom: 0.9;
    }
  }
`;

const Content = styled.div`
  display: flex;
  gap: 0 24px;
  align-items: center;
`;

const AlbumImage = styled.img`
  width: 58px;
  height: 58px;
  border-radius: 8px;
  box-shadow: ${Shadow.DOWN};
`;

const MusicInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px 0;
`;

const MusicTitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  color: ${Color.BLACK};
`;

const AlbumTitle = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: ${Color.BLUE};
`;

const LyricsWrapper = styled.div`
  display: flex;
  height: 42px;
  width: calc(100% - 32px);
  flex-direction: column;
  justify-content: space-between;
  gap: 6px 0;
`;

const LyricsHighlighted = styled.div`
  width: 100%;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  color: ${Color.BLACK};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Lyrics = styled.div`
  width: 100%;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  color: ${Color.GRAY};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin: -4px 0 0 0;
  align-items: center;
  justify-content: center;
  gap: 0 12px;
`;

const Button = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
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
  width: 14px;
  height: 14px;
`;

const ActiveButton = styled.div`
  display: inline-block;
  width: 86px;
  height: 28px;
  background: ${Color.BLUE};
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 28px;
  text-align: center;
  color: ${Color.WHITE};
  border-radius: 100px;
  cursor: pointer;
  user-select: none;
`;

const ModalBackground = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const ModalContent = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - 48px);
  max-width: 328px;
  padding: 24px 24px 18px 24px;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 8px;
  gap: 16px;
`;

const Close = styled.div`
  height: 24px;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLUE};
  user-select: none;
`;

enum Volume {
  LOW,
  MIDDLE,
  HIGH,
}

interface Props {
  radio: ActiveRadioState;
  timeDelta: number;
  userId: string;
  onSelect(id: string): void;
}

interface State {
  playing: boolean;
  volume: Volume;
  lyricsA: string | null;
  lyricsB: string | null;
  modal: boolean;
}

const cdnUrl = 'https://i.iz-cdn.kro.kr/stream?v2=';

export default class Radio extends Component<Props, State> {
  audio: HTMLAudioElement;
  interval: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      playing: true,
      volume: parseInt(localStorage.getItem('radio_volume')!) || Volume.HIGH,
      lyricsA: null,
      lyricsB: null,
      modal: false,
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

      let displayA = lyricsA[0];
      let displayB = lyricsB ? lyricsB[0] : null;

      if (this.props.radio.music.isJapanese) {
        displayA = lyricsA[1];
        displayB = lyricsA[2];
      }

      this.setState({ lyricsA: displayA, lyricsB: displayB });
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

  onVoteClick = () => {
    this.setState({ modal: true });
  };

  onCloseClick = () => {
    this.setState({ modal: false });
  };

  render() {
    return (
      <>
        <Layout>
          <Content>
            <AlbumImage src={this.props.radio.music.album.imageUrl} />
            <MusicInfo>
              <MusicTitle>{this.props.radio.music.title}</MusicTitle>
              <AlbumTitle>{this.props.radio.music.album.title}</AlbumTitle>
            </MusicInfo>
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
            <ActiveButton onClick={this.onVoteClick}>다음곡 투표</ActiveButton>
          </ButtonWrapper>
        </Layout>
        {this.state.modal && (
          <ModalBackground
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <ModalContent>
              <RadioVote
                radio={this.props.radio}
                timeDelta={this.props.timeDelta}
                userId={this.props.userId}
                onSelect={this.props.onSelect}
              />
              <Close onClick={this.onCloseClick}>닫기</Close>
            </ModalContent>
          </ModalBackground>
        )}
      </>
    );
  }
}
