'use strict';

import fastAutoplacement from '../_scripts/fast-autoplacement.js';

if(/MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
  var grid = document.getElementById('grid');
  new fastAutoplacement({
    grid: grid,
    direction: 'column',
    columns: '210px 210px 210px',
    rows: '150px 150px',
    height: true,
    width: true
  });
}