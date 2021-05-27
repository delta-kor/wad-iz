import { Component } from 'react';
import styled from 'styled-components';
import Socket from '../utils/socket';
import InstagramProfileCard from './card/InstagramProfileCard';

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
    profiles: [],
    selected: 0,
  };

  componentDidMount = () => {
    this.fetchProfiles();
  };

  fetchProfiles = async () => {
    const response = await this.props.socket.requestInstagramProfiles();
    this.setState({ profiles: response.profiles });
  };

  render() {
    return (
      <Layout>
        <InstagramProfileCard
          profiles={this.state.profiles}
          selected={this.state.selected}
          onSelect={index => this.setState({ selected: index })}
        />
      </Layout>
    );
  }
}
