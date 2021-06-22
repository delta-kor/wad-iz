import { motion } from 'framer-motion';
import { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Color } from '../../styles/color';
import { Shadow } from '../../styles/shadow';

const Layout = styled(motion.div)<any>`
  display: flex;
  width: 342px;
  height: 100%;
  padding: 32px 24px 32px 32px;
  flex-direction: column;
  gap: 16px 0;
  background: ${Color.WHITE};
  box-shadow: ${Shadow.DOWN};
  border-radius: 16px;
`;

const Markdown = styled(ReactMarkdown)`
  display: flex;
  padding: 0 8px 0 0;
  flex-direction: column;
  gap: 16px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  word-break: break-all;
  overflow-y: scroll;

  h4 {
    font-size: 18px;
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
  content: string;
}

export default class TimelineContent extends Component<Props, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      content: '',
    };
  }

  render() {
    return (
      <Layout layoutId={'history-card'}>
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
          {this.props.content || '불러오는 중...'}
        </Markdown>
      </Layout>
    );
  }
}
