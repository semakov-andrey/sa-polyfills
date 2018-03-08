'use strict';

import fastAutoplacement from '../_scripts/fast-autoplacement.js';

var grid = document.getElementById('grid');
new fastAutoplacement({
  grid: grid,
  direction: 'row',
  maxColumns: 60
});