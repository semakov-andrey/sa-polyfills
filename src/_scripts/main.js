window.addEventListener('DOMContentLoaded', function() {
    var grid = $('#grid');
    var items = $('#grid .item');
    var positionArray = [];
    var halfPositionArray = [];
    var autoFlowArray = [];
    var gridGlobalArray = [];
    var maxRows = 50;
    var maxColumns = 50;

    var gridStyle = window.getComputedStyle(grid[0]);
    var gridColumns = 0;
    if(gridStyle.msGridColumns) {
      var findColumns = /(.*?) \( 0px \)/g.exec(gridStyle.msGridColumns);
      if(findColumns && findColumns[1]) gridColumns = findColumns[1].split(' ');
    }
    var gridColumnsLength = gridColumns.length;

    var findPlace = function(row, rowSpan, column, columnSpan) {
      for(var i = 0; i < rowSpan; i++) {
        for(var j = 0; j < columnSpan; j++) {
          if(gridGlobalArray[row + i] && gridGlobalArray[row + i][column + j]) return false;
        }
      }
      return true;
    };

    items.each(function(index, element) {
      var itemStyle = window.getComputedStyle(element);
      if(itemStyle.msGridRow && Number(itemStyle.msGridRow) !== 999) {
        if(itemStyle.msGridColumn && Number(itemStyle.msGridColumn) !== 999) positionArray.push(element);
        else halfPositionArray.push(element);
      } else autoFlowArray.push(element);
    });

    $.each(positionArray, function(index, element) {
      var itemStyle = window.getComputedStyle(element);
      var row = Number(itemStyle.msGridRow);
      var rowSpan = itemStyle.msGridRowSpan ? Number(itemStyle.msGridRowSpan) : 1;
      var column = Number(itemStyle.msGridColumn);
      var columnSpan = itemStyle.msGridColumnSpan ? Number(itemStyle.msGridColumnSpan) : 1;
      if(itemStyle.order) element.style.zIndex = itemStyle.order;

      for(var i = 0; i < rowSpan; i++) {
        if(!gridGlobalArray[row + i]) gridGlobalArray[row + i] = [];
        for(var j = 0; j < columnSpan; j++) {
          gridGlobalArray[row + i][column + j] = true;
        }
      }
    });

    halfPositionArray.sort(function(a, b) {
      var aStyle = window.getComputedStyle(a);
      var bStyle = window.getComputedStyle(b);
      return aStyle.order - bStyle.order;
    });
    $.each(halfPositionArray, function(index, element) {
      var itemStyle = window.getComputedStyle(element);
      var row = Number(itemStyle.msGridRow);
      var rowSpan = itemStyle.msGridRowSpan ? Number(itemStyle.msGridRowSpan) : 1;
      var column = false;
      var columnSpan = itemStyle.msGridColumnSpan ? Number(itemStyle.msGridColumnSpan) : 1;
      if(itemStyle.order) element.style.zIndex = itemStyle.order;
      
      for(var i = 1; i <= maxColumns - columnSpan + 1; i++) {
        column = findPlace(row, rowSpan, i, columnSpan);
        if(column) {
          column = i;
          break;
        }
      }
      if(column) {
        element.style['-ms-grid-column'] = column;

        for(var i = 0; i < rowSpan; i++) {
          if(!gridGlobalArray[row + i]) gridGlobalArray[row + i] = [];
          for(var j = 0; j < columnSpan; j++) {
            gridGlobalArray[row + i][column + j] = true;
          }
        }
      } else $(element).hide();
    });

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