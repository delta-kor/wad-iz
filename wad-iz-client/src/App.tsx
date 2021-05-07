import React, { Component } from 'react';
import styled from 'styled-components';
import MoneyCard from './components/card/Money';
import Cover from './components/Cover';

const CardStack = styled.div`
  display: grid;
  margin: -94px 0 0 0;
  padding: 0 36px;
  grid-column: 1fr;
  row-gap: 24px;
`;

export default class App extends Component<any, any> {
  render() {
    return (
      <div>
        <Cover amount={3237563210}></Cover>
        <CardStack>
          <MoneyCard title={'직영'} label={'05/05 10:00'} amount={602483643} />
          <MoneyCard title={'wadiz'} label={'18,482 명 참여'} amount={2635224567} />
        </CardStack>
      </div>
    );
  }
}
