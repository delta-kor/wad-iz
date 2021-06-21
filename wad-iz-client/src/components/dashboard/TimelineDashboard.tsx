import { Component } from 'react';
import styled from 'styled-components';
import Socket from '../../utils/socket';
import ArticleTimeline from '../card/ArticleTimeline';
import TimelineContent from '../card/TimelineContent';
import UrlTimeline from '../card/UrlTimeline';

const Layout = styled.div<any>`
  display: flex;
  flex-direction: ${({ isPc }) => (isPc ? 'row' : 'column')};
  padding: ${({ isPc }) => (isPc ? '262px 0 0 0' : '0')};
  margin: 0 0 ${({ isPc }) => (isPc ? '32px' : '0')};
  gap: 24px;
  z-index: 2;
`;

const PcStickyFlex = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  top: calc((100vh - 770px) / 2);
  height: calc(100vh - ((100vh - 770px) / 2) * 2);
  gap: 24px 0;
`;

const PcFlex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px 0;
`;

interface Props {
  socket: Socket;
  isPc: boolean;
}

interface State {
  timeline: TimelineItem[];
  content: string;
}

export default class TimelineDashboard extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      timeline: [],
      content: '조회 할 글을 선택 해 주세요',
    };
  }

  componentDidMount = () => {
    this.fetchTimeline();
  };

  fetchTimeline = async () => {
    const response = await this.props.socket.requestTimeline();
    this.setState({ timeline: response.timeline });
  };

  render() {
    return (
      <Layout isPc={this.props.isPc}>
        {this.props.isPc && (
          <>
            <PcFlex>
              {this.state.timeline.map((timeline, index) => {
                if (timeline.action === 'url') {
                  return <UrlTimeline {...timeline} isPc={true} key={index} />;
                }
                if (timeline.action === 'article') {
                  return (
                    <ArticleTimeline
                      {...timeline}
                      socket={this.props.socket}
                      isPc={true}
                      setContent={content => this.setState({ content })}
                      key={index}
                    />
                  );
                }
              })}
            </PcFlex>
            <PcStickyFlex>
              <TimelineContent content={this.state.content} />
            </PcStickyFlex>
          </>
        )}
        {!this.props.isPc &&
          this.state.timeline.map((timeline, index) => {
            if (timeline.action === 'url') {
              return <UrlTimeline {...timeline} isPc={false} key={index} />;
            }
            if (timeline.action === 'article') {
              return (
                <ArticleTimeline
                  {...timeline}
                  isPc={false}
                  socket={this.props.socket}
                  key={index}
                />
              );
            }
          })}
      </Layout>
    );
  }
}
