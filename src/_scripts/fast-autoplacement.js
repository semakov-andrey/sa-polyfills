'user strict';

export default class AutoPlacement {
  constructor({
    selector,
    direction: direct = 'row',
    position = 999,
    ...params
  }) {
    if (!selector || typeof selector !== 'string') {
      console.error(`Can't find a grid selector`);
      return;
    }
    this.gridData = [];
    const grid = document.querySelector(selector);
    const cells = [...grid.children];
    const cross = direct === 'column' ? 'row' : 'column';
    const directProp = `msGrid${this.capitalizeFirstLetter(direct)}`;
    const crossProp = `msGrid${this.capitalizeFirstLetter(cross)}`; 
    const directSpanProp = `${directProp}Span`;
    const crossSpanProp = `${crossProp}Span`; 
    const fixedCells = [];
    const floatCells = [];
    const flowCells = [];
    const gridColumns = window.getComputedStyle(grid)[`${crossProp}s`].split('( 0px )');
    let maxColumns = 1;

    cells.forEach(element => {
      let {
        [directProp]: d,
        [crossProp]: c,
        [directSpanProp]: ds,
        [crossSpanProp]: cs
      } = window.getComputedStyle(element);
      d = Number(d);
      c = Number(c);
      ds = Number(ds);
      cs = Number(cs);
      (d !== position
        ? (c !== position ? fixedCells : floatCells)
        : flowCells
      ).push({
        row: d,
        column: c,
        rowSpan: ds,
        columnSpan: cs,
        node: element
      });
      if (c !== position && c + cs - 1 > maxColumns) {
        maxColumns = c + cs - 1;
      }
    });

    fixedCells.forEach(element => {  
      this.save(element);
    });

    floatCells.forEach(element => {
      let column;
      for (let i = 1; i < position - element.columnSpan + 1; i++) {
        column = this.search({ ...element, column: i });
        if (column) {
          column = i;
          break;
        }
      }
      if (column) {
        element.node.style[`-ms-grid-${cross}`] = column;
        this.save({ ...element, column });
      } else {
        element.node.style.display = 'none';
        console.error(`Can't find a cell position`);
      }
    });

    this.gridData.forEach(data => {
      if (data && data.length - 1 > maxColumns) {
        maxColumns = data.length - 1;
      }
    });

    console.log(maxColumns);

    let style1 = [];
    if (gridColumns[0]) {
      style1 = gridColumns[0].trim().split(' ');
    }
    let styleLength = style1.length;
    if (maxColumns > styleLength) {
      for(let i = 0; i < maxColumns - styleLength; i++) style1.push('1fr');
      grid.style[`-ms-grid-${cross}s`] = style1.join(' ');
    } else {
      maxColumns = styleLength;
    }


    
    // let gridCells = params[`${cross}s`] ? params[`${cross}s`].split(' ') : [];
    // let gridCellsLength = gridCells.length;
    // if(maxCells > gridCellsLength) {
    //   for(var i = 0; i < maxCells - gridCellsLength; i++) gridCells.push('1fr');
    // } else {
    //   maxCells = gridCellsLength;
    // }
    // grid.style[`-ms-grid-${cross}s`] = gridCells.join(' ');

    
    
    const directSize = direct === 'column' ? 'width' : 'height';            // ?  
    let maxRows = direct === 'column' && params.maxRows ? params.maxRows : 50;
    //let maxColumns = direct === 'row' && params.maxColumns ? params.maxColumns : 50;
    if(!cells.length) {
      return;
    }    

    


    // floatCells.sort((a, b) => {
    //   let aStyle = window.getComputedStyle(a);
    //   let bStyle = window.getComputedStyle(b);
    //   return aStyle.order - bStyle.order;
    // });

    // flowCells.sort((a, b) => {
    //   let aStyle = window.getComputedStyle(a);
    //   let bStyle = window.getComputedStyle(b);
    //   return aStyle.order - bStyle.order;
    // });




  
    // flowCells.forEach(element => {
    //   let itemStyle = window.getComputedStyle(element);
    //   let row = false;
    //   let rowSpan = itemStyle[`${directProp}Span`] ? Number(itemStyle[`${directProp}Span`]) : 1;
    //   let column = itemStyle[crossProp] && Number(itemStyle[crossProp]) !== position ? Number(itemStyle[crossProp]) : false;
    //   let columnSpan = itemStyle[`${crossProp}Span`] ? Number(itemStyle[`${crossProp}Span`]) : 1;
    //   let place = false;
    //   if(!column) {
    //     for(let j = 1; j <= maxRows; j++) {
    //       for(let k = 1; k <= maxCells - columnSpan + 1; k++) {
    //         place = this.searchLocation(j, rowSpan, k, columnSpan);
    //         if(place) {
    //           row = j;
    //           column = k;
    //           break;
    //         }
    //       }
    //       if(place) {
    //         break;
    //       }
    //     }
    //   } else {
    //     for(let j = 1; j <= maxRows; j++) {
    //       place = this.searchLocation(j, rowSpan, column, columnSpan);
    //       if(place) {
    //         row = j;
    //         break;
    //       }
    //     }
    //   }
    //   if(place) {
    //     element.style[`-ms-grid-${direct}`] = row;
    //     element.style[`-ms-grid-${cross}`] = column;
    //     this.save(row, rowSpan, column, columnSpan);
    //   } else {
    //     element.style.display = 'none';
    //   }
    // });

    // if(params[directSize]) {
    //   let gridCells = params[`${direct}s`] ? params[`${direct}s`].split(' ') : [];
    //   let gridCellsLength = gridCells.length;
    //   for(let i = gridCellsLength; i < this.gridData.length - 1; i++) {
    //     gridCells.push('1fr');
    //   }
    //   grid.style[`-ms-grid-${direct}s`] = gridCells.join(' ');
    // } else {
    //   if(params[direct + 's']) {
    //     grid.style[`-ms-grid-${direct}s`] = params[`${direct}s`];
    //   }
    // }
    // console.log(JSON.stringify(this.gridData));
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } 

  save({ row, rowSpan, column, columnSpan }) {
    for (let i = 0; i < rowSpan; i++) {
      if (!this.gridData[row + i]) {
        this.gridData[row + i] = [];
      }
      for (let j = 0; j < columnSpan; j++) {
        this.gridData[row + i][column + j] = true;
      }
    }
  }

  search({ row, rowSpan, column, columnSpan }) {
    for(let i = 0; i < rowSpan; i++) {
      for(let j = 0; j < columnSpan; j++) {
        if(this.gridData[row + i] && this.gridData[row + i][column + j]) {
          return false;
        }
      }
    }
    return true;
  }
}