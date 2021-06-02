import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import App from './App';
import './index.css';
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

console.log(
  `%c
                  d   b
MM   MMMMMMAMV     \\ / g8"""""8q.        MMMMM      ,,MMMMM,
MM        AMV   o=--*--=o       \`\`YM.  MN"   "NM    MM    \`Mb
MM       AMV       / \\           \`MM   MB     MB    MM
MM      AMV       d   b    ◇     MM   MB     MB    MMNMMMY
MM     AMV          MM.          ,MP   MB     MB    MM
MM    AMV           \`Mb.       ,,dP'   MB     MB    MM    ,dP
MM   AMVMMMMMM        \`"bmmmmmd"'      MB     MB    '"MMMMM"
`,
  'color: #FF50A0'
);
