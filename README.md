# Front-End polyfills. #
###### Some scripts for supporting new opportunities in old browsers. ######
###### It based on browser detection. ######

`sa-detection` - Functions for browser detection

`IE 10+` - `sa-closest` - Element.closest() polyfill  

### Usage ###
```
import detection from 'sa-detection';
import Closest from 'sa-closest';

if (detection.isIE10Plus()) new Closest();
```


`IE 10+` - `sa-grid-auto-placement` - CSS grid cell auto placement 

`Build` folder contains es6 modules for importing into the project.