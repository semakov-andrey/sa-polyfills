'user strict';

export default class fastAutoplacement {
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } 

  save(row, rowSpan, column, columnSpan) {
    for(let i = 0; i < rowSpan; i++) {
      if(!this.gridData[row + i]) {
        this.gridData[row + i] = [];
      }
      for(let j = 0; j < columnSpan; j++) {
        this.gridData[row + i][column + j] = true;
      }
    }
  }

  searchLocation(row, rowSpan, column, columnSpan) {
    for(let i = 0; i < rowSpan; i++) {
      for(let j = 0; j < columnSpan; j++) {
        if(this.gridData[row + i] && this.gridData[row + i][column + j]) {
          return false;
        }
      }
    }
    return true;
  }

  constructor(params) {
    if(!params.grid) {
      return;
    }
    let grid = params.grid,
      items = [].slice.call(grid.children),
      direct = params.direction ? params.direction : 'row',
      cross = direct !== 'row' ? 'row' : 'column',
      directProp = 'msGrid' + this.capitalizeFirstLetter(direct),
      crossProp = 'msGrid' + this.capitalizeFirstLetter(cross),
      directSize = direct === 'column' ? 'width' : 'height',
      fixedItems = [],
      floatItems = [],
      flowItems = [],
      maxRows = direct === 'column' && params.maxRows ? params.maxRows : 50,
      maxColumns = direct === 'row' && params.maxColumns ? params.maxColumns : 50,
      calcMaxRows = 0,
      calcMaxColumns = 0,
      startPosition = params.position ? params.position : 999;
    if(!items.length) {
      return;
    }
    this.gridData = [];

    window.addEventListener('DOMContentLoaded', () => { 
      let gridCells = params[cross + 's'] ? params[cross + 's'].split(' ') : [],
        gridCellsLength = gridCells.length;

      for(let i = 0; i < items.length; i++) {
        let element = items[i],
          itemStyle = window.getComputedStyle(element);
        if(itemStyle[directProp] && Number(itemStyle[directProp]) !== startPosition) {
          if(itemStyle[crossProp] && Number(itemStyle[crossProp]) !== startPosition) fixedItems.push(element);
          else {
            floatItems.push(element);
          }
        } else {
          flowItems.push(element);
        }
      }
      
      for(let i = 0; i < fixedItems.length; i++) {
        let element = fixedItems[i],
          itemStyle = window.getComputedStyle(element),
          row = Number(itemStyle[directProp]),
          rowSpan = itemStyle[directProp + 'Span'] ? Number(itemStyle[directProp + 'Span']) : 1,
          column = Number(itemStyle[crossProp]),
          columnSpan = itemStyle[crossProp + 'Span'] ? Number(itemStyle[crossProp + 'Span']) : 1;
        this.save(row, rowSpan, column, columnSpan);
      }
      
      floatItems.sort((a, b) => {
        let aStyle = window.getComputedStyle(a),
          bStyle = window.getComputedStyle(b);
        return aStyle.order - bStyle.order;
      });
      for(let i = 0; i < floatItems.length; i++) {
        let element = floatItems[i],
          itemStyle = window.getComputedStyle(element),
          row = Number(itemStyle[directProp]),
          rowSpan = itemStyle[directProp + 'Span'] ? Number(itemStyle[directProp + 'Span']) : 1,
          column = false,
          columnSpan = itemStyle[crossProp + 'Span'] ? Number(itemStyle[crossProp + 'Span']) : 1;
        for(let j = 1; j <= maxColumns - columnSpan + 1; j++) {
          column = this.searchLocation(row, rowSpan, j, columnSpan);
          if(column) {
            column = j;
            break;
          }
        }
        if(column) {
          element.style['-ms-grid-' + cross] = column;
          this.save(row, rowSpan, column, columnSpan);
        } else {
          element.style.display = 'none';
        }
      }

      let maxCells = 0;
      for(let i = 0; i < this.gridData.length; i++) {
        if(this.gridData[i] && this.gridData[i].length - 1 > maxCells) {
          maxCells = this.gridData[i].length - 1;
        }
      }
      for(let i = 0; i < flowItems.length; i++) {
        let element = flowItems[i],
          itemStyle = window.getComputedStyle(element),
          column = itemStyle[crossProp] && Number(itemStyle[crossProp]) !== startPosition ? Number(itemStyle[crossProp]) : 1,
          columnSpan = itemStyle[crossProp + 'Span'] ? Number(itemStyle[crossProp + 'Span']) : 1;
          if(column + columnSpan - 1 > maxCells) {
            maxCells = column + columnSpan - 1;
          }
      }
      if(maxCells > gridCellsLength) {
        for(var i = 0; i < maxCells - gridCellsLength; i++) gridCells.push('1fr');
      } else {
        maxCells = gridCellsLength;
      }
      grid.style['-ms-grid-' + cross + 's'] = gridCells.join(' ');

      flowItems.sort((a, b) => {
        let aStyle = window.getComputedStyle(a),
          bStyle = window.getComputedStyle(b);
        return aStyle.order - bStyle.order;
      });
      for(let i = 0; i < flowItems.length; i++) {
        let element = flowItems[i],
          itemStyle = window.getComputedStyle(element),
          row = false,
          rowSpan = itemStyle[directProp + 'Span'] ? Number(itemStyle[directProp + 'Span']) : 1,
          column = itemStyle[crossProp] && Number(itemStyle[crossProp]) !== startPosition ? Number(itemStyle[crossProp]) : false,
          columnSpan = itemStyle[crossProp + 'Span'] ? Number(itemStyle[crossProp + 'Span']) : 1,
          place = false;
        if(!column) {
          for(let j = 1; j <= maxRows; j++) {
            for(let k = 1; k <= maxCells - columnSpan + 1; k++) {
              place = this.searchLocation(j, rowSpan, k, columnSpan);
              if(place) {
                row = j;
                column = k;
                break;
              }
            }
            if(place) {
              break;
            }
          }
        } else {
          for(let j = 1; j <= maxRows; j++) {
            place = this.searchLocation(j, rowSpan, column, columnSpan);
            if(place) {
              row = j;
              break;
            }
          }
        }
        if(place) {
          element.style['-ms-grid-' + direct] = row;
          element.style['-ms-grid-' + cross] = column;
          this.save(row, rowSpan, column, columnSpan);
        } else {
          element.style.display = 'none';
        }
      }

      if(params[directSize]) {
        let gridCells = params[direct + 's'] ? params[direct + 's'].split(' ') : [],
          gridCellsLength = gridCells.length;
        for(let i = gridCellsLength; i < this.gridData.length - 1; i++) {
          gridCells.push('1fr');
        }
        grid.style['-ms-grid-' + direct + 's'] = gridCells.join(' ');
      } else {
        if(params[direct + 's']) {
          grid.style['-ms-grid-' + direct + 's'] = params[direct + 's'];
        }
      }
      //console.log(JSON.stringify(this.gridData));
    });
  }
}