import 'babel-polyfill';
import AutoPlacement from '../../build/scripts/fast-autoplacement.js';

import '../index.pug';
import '../styles/main.scss';

if(/MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
  window.addEventListener('DOMContentLoaded', () => {
    new AutoPlacement({
      selector: '#grid',
      direction: 'column',
      msGridColumns: '210px 210px 210px',
      msGridRows: '150px 150px 150px'
    });
  });
}