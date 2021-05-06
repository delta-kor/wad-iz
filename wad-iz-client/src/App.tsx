import React, { Component } from 'react';
import Cover from './components/Cover';

export default class App extends Component<any, any> {
  render() {
    return (
      <div>
        <Cover amount={3237563210}></Cover>
      </div>
    );
  }
}
