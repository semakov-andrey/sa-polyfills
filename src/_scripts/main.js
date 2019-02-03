'use strict';

import 'babel-polyfill';
import AutoPlacement from '../_scripts/fast-autoplacement.js';

if(/MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
  window.addEventListener('DOMContentLoaded', () => { 
    new AutoPlacement({
      selector: '#grid',
      direction: 'column',
      columns: '210px 210px 210px',
      rows: '150px 150px',
      height: true,
      width: true
    });
  });
}