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
    const grid = document.querySelector(selector);
    const cells = [...grid.children];
    if(!cells.length) {
      return;
    }
    this.gridData = [];
    const cross = direct === 'column' ? 'row' : 'column';
    const directProp = `msGrid${this.capitalizeFirstLetter(direct)}`;
    const crossProp = `msGrid${this.capitalizeFirstLetter(cross)}`; 
    const directSpanProp = `${directProp}Span`;
    const crossSpanProp = `${crossProp}Span`;
    const directTemplateProp = `${directProp}s`;
    const crossTemplateProp = `${crossProp}s`;    
    const fixedCells = [];
    const floatCells = [];
    const flowCells = [];
    const { [directTemplateProp]: dtp, [crossTemplateProp]: ctp } = window.getComputedStyle(grid);
    const gridRows = params[directTemplateProp] || dtp.split('( 0px )')[0];
    const gridColumns = params[crossTemplateProp] || ctp.split('( 0px )')[0];
    let maxColumns = 1;

    cells.forEach(element => {
      let {
        [directProp]: d,
        [crossProp]: c,
        [directSpanProp]: ds,
        [crossSpanProp]: cs,
        order
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
        order,
        node: element
      });
      if (c !== position && c + cs - 1 > maxColumns) {
        maxColumns = c + cs - 1;
      }
    });

    floatCells.sort((a, b) => a.order - b.order);
    flowCells.sort((a, b) => a.order - b.order);

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
        element.node.style[crossProp] = column;
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

    maxColumns = this.setColumns(grid, gridColumns, maxColumns, crossTemplateProp);

    flowCells.forEach(element => {
      let place;
      let row;
      let column;
      if (element.column !== position) {
        for (let i = 1; i < position - element.rowSpan + 1; i++) {
          place = this.search({ ...element, row: i });
          if (place) {
            row = i;
            break;
          }
        }
        if (place) {
          element.node.style[directProp] = row;
          this.save({ ...element, row });
        } else {
          element.node.style.display = 'none';
          console.error(`Can't find a cell position`);
        }
      } else {
        for(let i = 1; i < position - element.rowSpan + 1; i++) {
          for(let j = 1; j <= maxColumns - element.columnSpan + 1; j++) {
            place = this.search({ ...element, row: i, column: j });
            if(place) {
              row = i;
              column = j;
              break;
            }
          }
          if(place) {
            break;
          }
        } 
        if (place) {
          element.node.style[directProp] = row;
          element.node.style[crossProp] = column;
          this.save({ ...element, row, column });
        } else {
          element.node.style.display = 'none';
          console.error(`Can't find a cell position`);
        }
      }
    });

    this.setColumns(grid, gridRows, this.gridData.length - 1, directTemplateProp);
  }

  setColumns(grid, columns, maxColumns, styleName) {
    let template = [];
    if (columns) {
      template.push(...columns.trim().split(' '));
    }
    let length = template.length;
    if (maxColumns > length) {
      let i = maxColumns - length;
      while(i--) {
        template.push('1fr');
      }
      grid.style[styleName] = template.join(' ');
    } else {
      maxColumns = length;
    }
    return maxColumns;
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