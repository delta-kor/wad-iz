import React, { Component } from 'react';
import styled from 'styled-components';
import DayCard from './components/card/Day';
import MoneyCard from './components/card/Money';
import SurveyCard from './components/card/Survey';
import Cover from './components/Cover';

const CardStack = styled.div`
  display: grid;
  margin: -94px 0 0 0;
  padding: 0 36px 132px 36px;
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
          <DayCard total={4117562} up={21148894} down={17041332} />
          <SurveyCard
            totalAmount={3341459287}
            totalSupporter={9846}
            kwizAmount={3237563210}
            kwizSupporter={18482}
          />
        </CardStack>
      </div>
    );
  }
}
