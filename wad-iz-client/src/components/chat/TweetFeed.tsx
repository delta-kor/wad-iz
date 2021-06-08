import { Component } from 'react';
import styled from 'styled-components';
import TweetArrowIcon from '../../icon/tweet-arrow.svg';
import TweetIcon from '../../icon/tweet.svg';
import { Color } from '../../styles/color';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px 0;
  align-items: center;
`;

const HeadWrapper = styled.div`
  display: flex;
  gap: 0 8px;
  justify-content: center;
  align-items: center;
`;

const TwitterIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const TweetName = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: ${Color.BLACK};
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 0 8px;
  justify-content: center;
  align-items: center;
`;

const NumberChip = styled.div`
  width: 18px;
  height: 18px;
  background: ${Color.BLUE};
  border-radius: 4px;
`;

const NumberChipItem = styled.div`
  width: 100%;
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 20px;
  text-align: center;
  color: ${Color.WHITE};
`;

const TweetArrow = styled.img`
  width: 12px;
  height: 12px;
`;

const ContentText = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  color: ${Color.BLUE};
`;

interface InProps {
  type: 'in';
  name: string;
  rank: number;
}

interface UpdateProps {
  type: 'update';
  name: string;
  from: number;
  to: number;
}

interface OutProps {
  type: 'out';
  name: string;
}

type Props = InProps | UpdateProps | OutProps;

export default class TweetFeed extends Component<Props, any> {
  render() {
    return (
      <Layout>
        <HeadWrapper>
          <TwitterIcon src={TweetIcon} />
          <TweetName>{this.props.name}</TweetName>
        </HeadWrapper>
        <ContentWrapper>
          {this.props.type === 'in' && (
            <>
              <ContentText>순위권 진입</ContentText>
              <NumberChip>
                <NumberChipItem>{this.props.rank}</NumberChipItem>
              </NumberChip>
            </>
          )}
          {this.props.type === 'update' && (
            <>
              <NumberChip>
                <NumberChipItem>{this.props.from || '-'}</NumberChipItem>
              </NumberChip>
              <TweetArrow src={TweetArrowIcon} />

              <NumberChip>
                <NumberChipItem>{this.props.to}</NumberChipItem>
              </NumberChip>
            </>
          )}
          {this.props.type === 'out' && (
            <>
              <ContentText>순위권 외</ContentText>
            </>
          )}
        </ContentWrapper>
      </Layout>
    );
  }
}
