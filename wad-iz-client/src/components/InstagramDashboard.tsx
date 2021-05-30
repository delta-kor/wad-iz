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

const PcStickyFlex = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  top: calc((100% - 770px) / 2);
  gap: 32px 0;
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
    const cache = localStorage.getItem('instagram_profile_cache');
    if (cache) {
      const cacheData = JSON.parse(cache);
      this.setState({ profiles: cacheData });
    }

    const response = await this.props.socket.requestInstagramProfiles();
    this.setState({ profiles: response.profiles });
    localStorage.setItem('instagram_profile_cache', JSON.stringify(response.profiles));
    this.onProfileSelect(0);
  };

  onProfileSelect = async (index: number) => {
    const username = this.state.profiles[index].username;

    let totalCache: any;
    const cache = localStorage.getItem('instagram_post_cache');
    if (cache) {
      const cacheData = JSON.parse(cache);
      if (cacheData[username]) {
        this.setState({ selected: index, posts: cacheData[username] });
      }
      totalCache = cacheData;
    } else {
      totalCache = {};
    }

    const response = await this.props.socket.requestInstagramPosts(username);
    this.setState({ selected: index, posts: response.posts });

    totalCache[username] = response.posts;
    localStorage.setItem('instagram_post_cache', JSON.stringify(totalCache));
  };

  render() {
    const globalProps: any = {};
    if (this.props.isPc) globalProps.width = '342px;';
    return (
      <Layout isPc={this.props.isPc}>
        {this.props.isPc ? (
          <>
            <PcStickyFlex>
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
            </PcStickyFlex>

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
