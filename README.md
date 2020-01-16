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
import detection from 'sa-detection';
import Closest from 'sa-closest';

if (detection.isIE10Plus()) new Closest();
```
## sa-grid-auto-placement
`IE 10+` - CSS grid cell auto placement 

