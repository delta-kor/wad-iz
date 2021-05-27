import { Component } from 'react';
import styled from 'styled-components';
import Socket from '../utils/socket';
import InstagramPostCard from './card/InstagramPost';
import InstagramProfileCard from './card/InstagramProfile';
import InstagramSelectorCard from './card/InstagramSelector';
import InstagramSelectorPcCard from './card/InstagramSelectorPc';

const Layout = styled.div<any>`
  display: flex;
  padding: ${({ isPc }) => (isPc ? '262px 0 0 0' : '0')};
  height: ${({ isPc }) => (isPc ? '5000px' : 'auto')};
  gap: 32px 16px;
  flex-flow: column wrap;
  z-index: 2;

  ${({ isPc }) =>
    isPc
      ? `
  align-content: space-between;
  ::before,
  ::after {
    content: '';
    flex-basis: 100%;
    width: 0;
    order: 2;
  }`
      : ''}
`;

interface Props {
  socket: Socket;
  isPc: boolean;
}

interface State {
  profiles: InstagramProfile[];
  posts: InstagramPost[];
  selected: number;
}

export default class InstagramDashboard extends Component<Props, State> {
  state = {
    profiles: [] as InstagramProfile[],
    posts: [] as InstagramPost[],
    selected: 0,
  };

  componentDidMount = () => {
    this.fetchProfiles();
  };

  fetchProfiles = async () => {
    const response = await this.props.socket.requestInstagramProfiles();
    this.setState({ profiles: response.profiles });
    this.onProfileSelect(0);
  };

  onProfileSelect = async (index: number) => {
    this.setState({ selected: index, posts: [] });
    const response = await this.props.socket.requestInstagramPosts(
      this.state.profiles[index].username
    );
    this.setState({ posts: response.posts });
  };

  render() {
    const globalProps: any = {};
    if (this.props.isPc) globalProps.width = '342px;';
    return (
      <Layout isPc={this.props.isPc}>
        {this.props.isPc ? (
          <>
            {this.state.profiles[this.state.selected] && (
              <InstagramProfileCard
                profile={this.state.profiles[this.state.selected]}
                {...globalProps}
              />
            )}

            <InstagramSelectorPcCard
              profiles={this.state.profiles}
              selected={this.state.selected}
              onSelect={this.onProfileSelect}
            />
          </>
        ) : (
          <>
            <InstagramSelectorCard
              profiles={this.state.profiles}
              selected={this.state.selected}
              onSelect={this.onProfileSelect}
            />

            {this.state.profiles[this.state.selected] && (
              <InstagramProfileCard
                profile={this.state.profiles[this.state.selected]}
                {...globalProps}
              />
            )}
          </>
        )}
        {this.state.posts.map((post, index) => (
          <InstagramPostCard key={index} post={post} {...globalProps} />
        ))}
      </Layout>
    );
  }
}
