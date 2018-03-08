'user strict';

import $ from 'jquery';

export default class fastAutoplacement {
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } 

  getGridCells(gridStyle, direction) {
    if(gridStyle['msGrid' + direction]) {
      let search = /(.*?) \( 0px \)/g.exec(gridStyle['msGrid' + direction]);
      return search && search[1] ? search[1].split(' ') : [];
    } else {
      return [];
    }
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
      fixedItems = [],
      floatItems = [],
      flowItems = [],
      maxRows = direct === 'column' && params.maxRows ? params.maxRows : 50,
      maxColumns = direct === 'row' && params.maxColumns ? params.maxColumns : 50,
      startPosition = params.position ? params.position : 999;
    if(!items.length) {
      return;
    }
    this.gridData = [];

    window.addEventListener('DOMContentLoaded', () => {      
      let gridStyle = window.getComputedStyle(grid),
        gridRows = this.getGridCells(gridStyle, 'Rows'),
        gridColumns = this.getGridCells(gridStyle, 'Columns'),
        gridRowsLength = gridRows.length,
        gridColumnsLength = gridColumns.length;

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
        if(itemStyle.order) {
          element.style.zIndex = itemStyle.order;
        }
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
        if(itemStyle.order) {
          element.style.zIndex = itemStyle.order;
        }        
        for(let j = 1; j <= maxColumns - columnSpan + 1; j++) {
          column = this.searchLocation(row, rowSpan, j, columnSpan);
          if(column) {
            column = i;
            break;
          }
        }
        if(column) {
          element.style['-ms-grid-column'] = column;
          this.save(row, rowSpan, column, columnSpan);
        } else element.style.display = 'none';
      }
      
      maxColumns = 0;
      for(var i = 0; i < gridGlobalArray.length; i++) {
        if(gridGlobalArray[i] && gridGlobalArray[i].length - 1 > maxColumns) maxColumns = gridGlobalArray[i].length - 1;
      }
      $.each(autoFlowArray, function(index, element) {
        var itemStyle = window.getComputedStyle(element);
        var column = itemStyle.msGridColumn && Number(itemStyle.msGridColumn) !== 999 ? Number(itemStyle.msGridColumn) : 1;
        var columnSpan = itemStyle.msGridColumnSpan ? Number(itemStyle.msGridColumnSpan) : 1;
        if(column + columnSpan - 1 > maxColumns) maxColumns = column + columnSpan - 1;
      });
      if(maxColumns > gridColumnsLength) {
        for(var i = 0; i < maxColumns - gridColumnsLength; i++) gridColumns.push('1fr');
        grid[0].style['-ms-grid-columns'] = gridColumns.join(' ');
      }
      
      autoFlowArray.sort(function(a, b) {
        var aStyle = window.getComputedStyle(a);
        var bStyle = window.getComputedStyle(b);
        return aStyle.order - bStyle.order;
      });
      $.each(autoFlowArray, function(index, element) {
        var itemStyle = window.getComputedStyle(element);
        var row = false;
        var rowSpan = itemStyle.msGridRowSpan ? Number(itemStyle.msGridRowSpan) : 1;
        var column = itemStyle.msGridColumn && Number(itemStyle.msGridColumn) !== 999 ? Number(itemStyle.msGridColumn) : false;
        var columnSpan = itemStyle.msGridColumnSpan ? Number(itemStyle.msGridColumnSpan) : 1;
      
        var place = false;
        for(var i = 1; i <= maxRows; i++) {
        for(var j = 1; j <= maxColumns - columnSpan + 1; j++) {
          place = findPlace(i, rowSpan, j, columnSpan);
          if(place) {
          row = i;
          column = j;
          break;
          }
        }
        if(place) break;
        }
        if(place) {
        element.style['-ms-grid-row'] = row;
        element.style['-ms-grid-column'] = column;
      
        for(var i = 0; i < rowSpan; i++) {
          if(!gridGlobalArray[row + i]) gridGlobalArray[row + i] = [];
          for(var j = 0; j < columnSpan; j++) {
          gridGlobalArray[row + i][column + j] = true;
          }
        }
        } else $(element).hide();
      });
      
      console.log(JSON.stringify(gridGlobalArray));
      });
      
  }
}