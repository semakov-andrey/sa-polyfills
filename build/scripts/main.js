(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';
'user strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fastAutoplacement = function () {
  _createClass(fastAutoplacement, [{
    key: 'capitalizeFirstLetter',
    value: function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }, {
    key: 'getGridCells',
    value: function getGridCells(gridStyle, direction) {
      if (gridStyle[direction]) {
        if (gridStyle[direction][0] !== '(') {
          var search = /(.*?) \( 0px \)/g.exec(gridStyle[direction]);
          return search && search[1] ? search[1].split(' ') : [];
        } else {
          return [];
        }
      } else {
        return [];
      }
    }
  }, {
    key: 'save',
    value: function save(row, rowSpan, column, columnSpan) {
      for (var i = 0; i < rowSpan; i++) {
        if (!this.gridData[row + i]) {
          this.gridData[row + i] = [];
        }
        for (var j = 0; j < columnSpan; j++) {
          this.gridData[row + i][column + j] = true;
        }
      }
    }
  }, {
    key: 'searchLocation',
    value: function searchLocation(row, rowSpan, column, columnSpan) {
      for (var i = 0; i < rowSpan; i++) {
        for (var j = 0; j < columnSpan; j++) {
          if (this.gridData[row + i] && this.gridData[row + i][column + j]) {
            return false;
          }
        }
      }
      return true;
    }
  }]);

  function fastAutoplacement(params) {
    var _this = this;

    _classCallCheck(this, fastAutoplacement);

    if (!params.grid) {
      return;
    }
    var grid = params.grid,
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
        calcMaxRows = 0,
        calcMaxColumns = 0,
        startPosition = params.position ? params.position : 999;
    if (!items.length) {
      return;
    }
    this.gridData = [];

    window.addEventListener('DOMContentLoaded', function () {
      var gridCells = void 0,
          gridCellsLength = void 0;
      if (!params[cross + 's']) {
        var gridStyle = window.getComputedStyle(grid);
        gridCells = _this.getGridCells(gridStyle, crossProp + 's');
      } else {
        gridCells = params[cross + 's'].split(' ');
      }
      gridCellsLength = gridCells.length;

      for (var _i = 0; _i < items.length; _i++) {
        var element = items[_i],
            itemStyle = window.getComputedStyle(element);
        if (itemStyle[directProp] && Number(itemStyle[directProp]) !== startPosition) {
          if (itemStyle[crossProp] && Number(itemStyle[crossProp]) !== startPosition) fixedItems.push(element);else {
            floatItems.push(element);
          }
        } else {
          flowItems.push(element);
        }
      }

      for (var _i2 = 0; _i2 < fixedItems.length; _i2++) {
        var _element = fixedItems[_i2],
            _itemStyle = window.getComputedStyle(_element),
            row = Number(_itemStyle[directProp]),
            rowSpan = _itemStyle[directProp + 'Span'] ? Number(_itemStyle[directProp + 'Span']) : 1,
            column = Number(_itemStyle[crossProp]),
            columnSpan = _itemStyle[crossProp + 'Span'] ? Number(_itemStyle[crossProp + 'Span']) : 1;
        _this.save(row, rowSpan, column, columnSpan);
      }

      floatItems.sort(function (a, b) {
        var aStyle = window.getComputedStyle(a),
            bStyle = window.getComputedStyle(b);
        return aStyle.order - bStyle.order;
      });
      for (var _i3 = 0; _i3 < floatItems.length; _i3++) {
        var _element2 = floatItems[_i3],
            _itemStyle2 = window.getComputedStyle(_element2),
            _row = Number(_itemStyle2[directProp]),
            _rowSpan = _itemStyle2[directProp + 'Span'] ? Number(_itemStyle2[directProp + 'Span']) : 1,
            _column = false,
            _columnSpan = _itemStyle2[crossProp + 'Span'] ? Number(_itemStyle2[crossProp + 'Span']) : 1;
        for (var j = 1; j <= maxColumns - _columnSpan + 1; j++) {
          _column = _this.searchLocation(_row, _rowSpan, j, _columnSpan);
          if (_column) {
            _column = j;
            break;
          }
        }
        if (_column) {
          _element2.style['-ms-grid-' + cross] = _column;
          _this.save(_row, _rowSpan, _column, _columnSpan);
        } else {
          _element2.style.display = 'none';
        }
      }

      var maxCells = 0;
      for (var _i4 = 0; _i4 < _this.gridData.length; _i4++) {
        if (_this.gridData[_i4] && _this.gridData[_i4].length - 1 > maxCells) {
          maxCells = _this.gridData[_i4].length - 1;
        }
      }
      for (var _i5 = 0; _i5 < flowItems.length; _i5++) {
        var _element3 = flowItems[_i5],
            _itemStyle3 = window.getComputedStyle(_element3),
            _column2 = _itemStyle3[crossProp] && Number(_itemStyle3[crossProp]) !== startPosition ? Number(_itemStyle3[crossProp]) : 1,
            _columnSpan2 = _itemStyle3[crossProp + 'Span'] ? Number(_itemStyle3[crossProp + 'Span']) : 1;
        if (_column2 + _columnSpan2 - 1 > maxCells) {
          maxCells = _column2 + _columnSpan2 - 1;
        }
      }
      if (maxCells > gridCellsLength) {
        for (var i = 0; i < maxCells - gridCellsLength; i++) {
          gridCells.push('1fr');
        }
      } else {
        maxCells = gridCellsLength;
      }
      grid.style['-ms-grid-' + cross + 's'] = gridCells.join(' ');

      flowItems.sort(function (a, b) {
        var aStyle = window.getComputedStyle(a),
            bStyle = window.getComputedStyle(b);
        return aStyle.order - bStyle.order;
      });
      for (var _i6 = 0; _i6 < flowItems.length; _i6++) {
        var _element4 = flowItems[_i6],
            _itemStyle4 = window.getComputedStyle(_element4),
            _row2 = false,
            _rowSpan2 = _itemStyle4[directProp + 'Span'] ? Number(_itemStyle4[directProp + 'Span']) : 1,
            _column3 = _itemStyle4[crossProp] && Number(_itemStyle4[crossProp]) !== startPosition ? Number(_itemStyle4[crossProp]) : false,
            _columnSpan3 = _itemStyle4[crossProp + 'Span'] ? Number(_itemStyle4[crossProp + 'Span']) : 1,
            place = false;
        if (!_column3) {
          for (var _j = 1; _j <= maxRows; _j++) {
            for (var k = 1; k <= maxCells - _columnSpan3 + 1; k++) {
              place = _this.searchLocation(_j, _rowSpan2, k, _columnSpan3);
              if (place) {
                _row2 = _j;
                _column3 = k;
                break;
              }
            }
            if (place) {
              break;
            }
          }
        } else {
          for (var _j2 = 1; _j2 <= maxRows; _j2++) {
            place = _this.searchLocation(_j2, _rowSpan2, _column3, _columnSpan3);
            if (place) {
              _row2 = _j2;
              break;
            }
          }
        }
        if (place) {
          _element4.style['-ms-grid-' + direct] = _row2;
          _element4.style['-ms-grid-' + cross] = _column3;
          _this.save(_row2, _rowSpan2, _column3, _columnSpan3);
        } else {
          _element4.style.display = 'none';
        }
      }

      //console.log(JSON.stringify(this.gridData));
    });
  }

  return fastAutoplacement;
}();

exports.default = fastAutoplacement;

},{}],2:[function(require,module,exports){
'use strict';

var _fastAutoplacement = require('../_scripts/fast-autoplacement.js');

var _fastAutoplacement2 = _interopRequireDefault(_fastAutoplacement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (/MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
  var grid = document.getElementById('grid');
  new _fastAutoplacement2.default({
    grid: grid,
    direction: 'row',
    columns: '1fr 1fr 1fr 1fr'
  });
}

},{"../_scripts/fast-autoplacement.js":1}]},{},[2]);
