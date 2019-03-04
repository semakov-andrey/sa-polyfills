import './index.pug';
import './index.scss';
import 'babel-polyfill';
import detection from '../sa-detection';
import GridAutoPlacement from '../sa-grid-auto-placement';

if (detection.isIE10Plus()) {
  window.addEventListener('DOMContentLoaded', () => {
    new GridAutoPlacement({
      selector: '#grid',
      direction: 'column',
      msGridColumns: '210px 210px 210px',
      msGridRows: '150px 150px 150px'
    });
  });
}