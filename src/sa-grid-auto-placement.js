export default class GridAutoPlacement {
  constructor({
    selector,
    direction: direct = 'row',
    position = 999,
    ...params
  }) {
    if (!selector || typeof selector !== 'string') {
      console.error("Can't find a grid selector");
      return;
    }
    const grid = document.querySelector(selector);
    const cells = [ ...grid.children ];
    if (!cells.length) return;
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

    fixedCells.forEach(element => {
      this.save(element);
    });

    floatCells.sort((a, b) => a.order - b.order);
    floatCells.forEach(element => {
      const length = position - element.columnSpan + 1;
      this.searchByDirection(element, length, 'column', crossProp);
    });

    this.gridData.forEach(data => {
      if (data && data.length - 1 > maxColumns) {
        maxColumns = data.length - 1;
      }
    });
    maxColumns = this.setColumns(grid, gridColumns, maxColumns, crossTemplateProp);

    flowCells.sort((a, b) => a.order - b.order);
    flowCells.forEach(element => {
      if (element.column !== position) {
        this.searchByDirection(element, position - element.rowSpan + 1, 'row', directProp);
      } else {
        this.searchByGrid(element, position - element.rowSpan + 1, maxColumns - element.columnSpan + 1, 'row', 'column', directProp, crossProp);
      }
    });

    this.setColumns(grid, gridRows, this.gridData.length - 1, directTemplateProp);
  }

  setColumns(grid, columns, maxColumns, styleName) {
    let maximum = maxColumns;
    const template = [];
    if (columns) {
      template.push(...columns.trim().split(' '));
    }
    const length = template.length;
    if (maximum > length) {
      let i = maximum - length;
      while (i--) {
        template.push('1fr');
      }
      grid.style[styleName] = template.join(' ');
    } else {
      maximum = length;
    }
    return maximum;
  }

  capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

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
    for (let i = 0; i < rowSpan; i++) {
      for (let j = 0; j < columnSpan; j++) {
        if (this.gridData[row + i] && this.gridData[row + i][column + j]) return false;
      }
    }
    return true;
  }

  searchByDirection(element, length, property, styleName) {
    let place = false;
    for (let i = 1; i < length; i++) {
      place = this.search({ ...element, [property]: i });
      if (place) {
        place = i;
        break;
      }
    }
    if (place) {
      element.node.style[styleName] = place;
      this.save({ ...element, [property]: place });
    } else {
      element.node.style.display = 'none';
      console.error("Can't find a cell position");
    }
  }

  searchByGrid(element, directLength, crosslength, directProperty, crossProperty, styleNameDirect, styleNameCross) {
    let place = false;
    for (let i = 1; i < directLength; i++) {
      for (let j = 1; j <= crosslength; j++) {
        place = this.search({ ...element, [directProperty]: i, [crossProperty]: j });
        if (place) {
          place = [ i, j ];
          break;
        }
      }
      if (place) break;
    }
    if (place) {
      element.node.style[styleNameDirect] = place[0];
      element.node.style[styleNameCross] = place[1];
      this.save({ ...element, row: place[0], column: place[1] });
    } else {
      element.node.style.display = 'none';
      console.error("Can't find a cell position");
    }
  }
}