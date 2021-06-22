import { motion } from 'framer-motion';
import { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import TimelineArrowIcon from '../../icon/timeline-arrow.svg';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';
import Socket from '../../utils/socket';

const Layout = styled.div<any>`
  display: flex;
  width: ${({ isPc }) => (isPc ? '342px' : 'unset')};
  padding: 32px;
  flex-direction: column;
  gap: 16px 0;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Type = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  color: ${Color.BLACK};
`;

const Date = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  color: ${Color.BLUE};
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 8px;
  text-decoration: none;
  user-select: none;
  cursor: pointer;
`;

const Icon = styled.img<any>`
  width: 16px;
  height: 16px;
  transform: ${({ active }) => (active ? 'rotate(180deg)' : 'unset')};
  transition: transform 0.2s;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px 0;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  color: ${Color.BLUE};
`;

const Description = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: ${Color.GRAY};
`;

const MarkdownWrapper = styled(motion.div)`
  width: calc(100% + 14px);
  overflow: hidden;
`;

const Markdown = styled(ReactMarkdown)`
  display: flex;
  padding: 0 10px 0 0;
  max-height: 480px;
  flex-direction: column;
  gap: 16px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  word-break: break-all;
  overflow-y: scroll;

  h4 {
    font-size: 16px;
    padding: 0 0 8px 0;
    border-bottom: 2px solid ${Color.GRAY};
  }

  a {
    text-decoration: none;
    color: ${Color.PURPLE};
  }

  img {
    width: 100%;
  }

  ol {
    display: flex;
    flex-direction: column;
    padding: 0 0 0 18px;
    gap: 16px 0;
  }

  ol > li::marker {
    font-weight: bold;
    color: ${Color.BLUE};
  }

  ::-webkit-scrollbar {
    display: block;
    width: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${Color.BLUE};
    border-radius: 10000px;
  }
`;

interface Props {
  type: string;
  date: string;
  title: string;
  description: string;
  content_id: string;
  socket: Socket;
  isPc: boolean;
  setContent?(content: string): void;
}

interface State {
  expand: boolean;
  content: null | string;
}

export default class ArticleTimeline extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      expand: false,
      content: null,
    };
  }

  componentDidUpdate = async (props: Props, state: State) => {
    if (this.props.isPc && state.expand !== this.state.expand) {
      if (!this.state.content) {
        this.props.setContent && this.props.setContent('');
        const response = await this.props.socket.requestTimelineContent(this.props.content_id);
        if (response.content) {
          this.props.setContent && this.props.setContent(response.content);
          this.setState({ content: response.content });
        }
      } else {
        this.props.setContent && this.props.setContent(this.state.content);
      }
      return true;
    }

    if (state.expand !== this.state.expand && this.state.expand) {
      if (this.state.content) return false;
      const response = await this.props.socket.requestTimelineContent(this.props.content_id);
      if (response.content) {
        if (!this.props.isPc) {
          this.setState({ content: response.content });
        }
      }
    }
  };

  onExpandClick = () => {
    this.setState({ expand: !this.state.expand });
  };

  render() {
    return (
      <Layout isPc={this.props.isPc}>
        <Header>
          <Type>{this.props.type}</Type>
          <Date>{this.props.date}</Date>
        </Header>
        <Content onClick={this.onExpandClick}>
          <TextWrapper>
            <Title>{this.props.title}</Title>
            <Description>{this.props.description}</Description>
          </TextWrapper>
          <Icon src={TimelineArrowIcon} active={this.state.expand && !this.props.isPc} />
        </Content>
        {this.state.expand && !this.props.isPc && (
          <MarkdownWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Markdown
              components={{
                a({ className, children, ...props }) {
                  return (
                    <a href={props.href as string} target={'_blank'} className={className}>
                      {children}
                    </a>
                  );
                },
              }}
            >
              {this.state.content || '불러오는 중...'}
            </Markdown>
          </MarkdownWrapper>
        )}
      </Layout>
    );
  }
}
