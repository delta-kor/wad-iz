import { Component } from 'react';
import styled from 'styled-components';
import Socket from '../utils/socket';
import InstagramPostCard from './card/InstagramPost';
import InstagramProfileCard from './card/InstagramProfile';
import InstagramSelectorCard from './card/InstagramSelector';
import InstagramSelectorPcCard from './card/InstagramSelectorPc';

const Layout = styled.div<any>`
  display: flex;
  flex-direction: ${({ isPc }) => (isPc ? 'row' : 'column')};
  padding: ${({ isPc }) => (isPc ? '262px 0 0 0' : '0')};
  margin: 0 0 ${({ isPc }) => (isPc ? '32px' : '0')};
  gap: 32px;
  z-index: 2;
`;

const PcFlex = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px 0;
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
    const response = await this.props.socket.requestInstagramPosts(
      this.state.profiles[index].username
    );
    this.setState({ selected: index, posts: response.posts });
  };

  render() {
    const globalProps: any = {};
    if (this.props.isPc) globalProps.width = '342px;';
    return (
      <Layout isPc={this.props.isPc}>
        {this.props.isPc ? (
          <>
            <PcFlex>
              <InstagramSelectorPcCard
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
            </PcFlex>

            <PcFlex>
              {this.state.posts.map((post, index) => (
                <InstagramPostCard key={index} post={post} {...globalProps} index={index} />
              ))}
            </PcFlex>
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

            {this.state.posts.map((post, index) => (
              <InstagramPostCard key={index} post={post} {...globalProps} index={index} />
            ))}
          </>
        )}
      </Layout>
    );
  }
}
