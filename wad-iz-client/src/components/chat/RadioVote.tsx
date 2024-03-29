import { Component } from 'react';
import styled from 'styled-components';
import { Color } from '../../styles/color';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 18px 0;
  user-select: none;
`;

const Header = styled.div`
  display: flex;
  height: 24px;
  justify-content: space-between;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: ${Color.BLACK};
`;

const Timer = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
  text-align: right;
  color: ${Color.BLUE};
`;

const VoteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px 0;
`;

const VoteItem = styled.div<any>`
  display: flex;
  min-height: 40px;
  padding: 16px 24px;
  justify-content: space-between;
  align-items: center;
  background: ${Color.BACKGROUND};
  border-radius: 8px;
  box-shadow: ${({ active }) => (active ? ` 0px 0px 0px 3px ${Color.BLUE}` : 'none')};
  cursor: pointer;
  user-select: none;
  transition: 500ms box-shadow;
`;

const VoteItemTitle = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: ${Color.BLACK};
`;

const VoteItemSubtitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  color: ${Color.GRAY};
`;

const VoteItemHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

const VoteItemPercent = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  color: ${Color.BLUE};
`;

const VoteTotal = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  color: ${Color.GRAY};
`;

interface Props {
  radio: ActiveRadioState;
  timeDelta: number;
  userId: string;
  onSelect(id: string): void;
}

interface State {
  seconds: number;
}

export default class RadioVote extends Component<Props, State> {
  interval: any;
  state = {
    seconds: 0,
  };

  componentDidMount = () => {
    this.interval = setInterval(() => {
      const seconds = Math.round(
        (this.props.radio.until - this.props.timeDelta - new Date().getTime()) / 1000
      );
      this.setState({ seconds });
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  render() {
    const full = this.state.seconds + 1;
    const second = full % 60;
    const minute = Math.floor(full / 60);
    const text = minute ? `${minute}분 ${second}초` : `${second}초`;

    let total: number = 0;
    for (const vote of this.props.radio.vote) total += vote.voter.length;

    return (
      <Layout>
        <Header>
          <Title>다음곡 투표</Title>
          <Timer>{text} 후 종료</Timer>
        </Header>
        <VoteWrapper>
          {this.props.radio.vote.map((vote, index) => (
            <VoteItem
              onClick={() => this.props.onSelect(vote.music.id!)}
              active={vote.voter.includes(this.props.userId)}
              key={vote.music.id}
            >
              <VoteItemHeader>
                <VoteItemTitle>{vote.music.title}</VoteItemTitle>
                {vote.music.subtitle && <VoteItemSubtitle>{vote.music.subtitle}</VoteItemSubtitle>}
              </VoteItemHeader>
              <VoteItemPercent>
                {Math.round((vote.voter.length / (total || 1)) * 100)}%
              </VoteItemPercent>
            </VoteItem>
          ))}
        </VoteWrapper>
        <VoteTotal>{total}명 참여</VoteTotal>
      </Layout>
    );
  }
}
