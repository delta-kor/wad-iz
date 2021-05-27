import { Component } from 'react';
import styled from 'styled-components';
import Socket from '../utils/socket';
import InstagramProfileCard from './card/InstagramProfileCard';
import InstagramSelectorCard from './card/InstagramSelectorCard';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px 0;
  z-index: 2;
`;

interface Props {
  socket: Socket;
  isPc: boolean;
}

interface State {
  profiles: InstagramProfile[];
  selected: number;
}

export default class InstagramDashboard extends Component<Props, State> {
  state = {
    profiles: [] as InstagramProfile[],
    selected: 0,
  };

  componentDidMount = () => {
    this.fetchProfiles();
  };

  fetchProfiles = async () => {
    const response = await this.props.socket.requestInstagramProfiles();
    this.setState({ profiles: response.profiles });
  };

  onProfileSelect = async (index: number) => {
    this.setState({ selected: index });
    const response = await this.props.socket.requestInstagramPosts(
      this.state.profiles[index].username
    );
  };

  render() {
    return (
      <Layout>
        <InstagramSelectorCard
          profiles={this.state.profiles}
          selected={this.state.selected}
          onSelect={this.onProfileSelect}
        />
        {this.state.profiles[this.state.selected] && (
          <InstagramProfileCard profile={this.state.profiles[this.state.selected]} />
        )}
      </Layout>
    );
  }
}
