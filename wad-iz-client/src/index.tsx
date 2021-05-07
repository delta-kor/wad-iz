import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Color } from './styles/color';

const Global = createGlobalStyle`
  body {
    background: ${Color.BACKGROUND}
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <Global />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
