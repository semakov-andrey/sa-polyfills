## Front-End polyfills
Some scripts for supporting new opportunities in old browsers.
It based on browser detection.  
`Build` folder contains es6 modules for importing into the project.

1. [sa-detection](#sa-detection)
2. [sa-closest](#sa-closest)
3. [sa-grid-auto-placement](#sa-grid-auto-placement)

## sa-detection
Functions for browser detection

### List of functions

|                      |
| -------------------- |
| isIE10               |
| isIE11               |
| isEdge               |
| isEdgeChromium       |
| isIE10Plus           |
| isIEOrEdge           |
| isSafari             |
| isAppleDevice        |
| isFirefox            |
| isChrome             |
| isOpera              |


## sa-closest
`IE 10+` - Element.closest() polyfill

### Usage
```
import { detection } from 'sa-polyfills';
import { Closest } from 'sa-polyfills';

if (detection.isIE10Plus()) new Closest();
```
## sa-grid-auto-placement
`IE 10+` - CSS grid cell auto placement 

### Usage
```
import { detection } from 'sa-polyfills';
import { GridAutoPlacement } from 'sa-polyfills';

if (detection.isIE10Plus()) {
  new GridAutoPlacement({
    selector: '#grid',
    direction: 'column',
    msGridColumns: '210px 210px 210px',
    msGridRows: '150px 150px 150px',
    gap: 10
  });
};

--------------------------------------------------------------------------

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .item {
    -ms-grid-row: 999;
    -ms-grid-column: 999;
  }
}
```

### List of parameters
|                      |                                    |
| -------------------- | ---------------------------------- |
| selector             | Grid element selector              |
| direction            | Direction of grid                  |
| msGridColumns        | CSS grid-template-columns for IE   |
| msGridRows           | CSS grid-template-rows for IE      |

### Additional
For using CSS grip-gap you need add padding for grid and margin for grid item:
```
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .grid {
    padding: 5px;
  }

  .item {
    margin: 5px;
  }
}
```