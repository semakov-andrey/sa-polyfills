import './index.pug';
import './index.css';
import 'babel-polyfill';
import detection          from '../sa-detection';
import GridAutoPlacement  from '../sa-grid-auto-placement';
import Closest            from '../sa-closest';

if (detection.isIE10Plus()) {
  new Closest();
  window.addEventListener('DOMContentLoaded', () => {
    new GridAutoPlacement({
      selector: '#grid',
      direction: 'column',
      msGridColumns: '210px 210px 210px',
      msGridRows: '150px 150px 150px'
    });
  });
}

const class1 = document.querySelector('.start-class-1').closest('.finish-class-1');
const class2 = document.querySelector('.start-class-2').closest('.finish-class-2');
console.info(class1, class2);