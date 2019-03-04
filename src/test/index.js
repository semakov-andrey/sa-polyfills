import './index.pug';
import './index.scss';
import 'babel-polyfill';
import GridAutoPlacement from '../sa-grid-auto-placement.js';

if (/MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
  window.addEventListener('DOMContentLoaded', () => {
    new GridAutoPlacement({
      selector: '#grid',
      direction: 'column',
      msGridColumns: '210px 210px 210px',
      msGridRows: '150px 150px 150px'
    });
  });
}