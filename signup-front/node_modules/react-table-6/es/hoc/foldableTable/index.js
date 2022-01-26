var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable */

import React from 'react';
import left from './left.svg';
import right from './right.svg';

var defaultFoldIconComponent = function defaultFoldIconComponent(_ref) {
  var collapsed = _ref.collapsed;

  var style = { width: 25 };

  if (collapsed) return React.createElement('img', { src: right, style: style, alt: 'right' });
  return React.createElement('img', { src: left, style: style, alt: 'left' });
};

var defaultFoldButtonComponent = function defaultFoldButtonComponent(_ref2) {
  var header = _ref2.header,
      collapsed = _ref2.collapsed,
      icon = _ref2.icon,
      onClick = _ref2.onClick;

  var style = {
    marginLeft: '0px',
    marginTop: '-5px',
    marginBottom: '-8px',
    float: 'left',
    cursor: 'pointer'
  };

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { style: style, onClick: onClick },
      icon
    ),
    !collapsed && React.createElement(
      'div',
      null,
      header
    )
  );
};

export default (function (ReactTable) {
  var wrapper = function (_React$Component) {
    _inherits(RTFoldableTable, _React$Component);

    function RTFoldableTable(props, context) {
      _classCallCheck(this, RTFoldableTable);

      var _this = _possibleConstructorReturn(this, (RTFoldableTable.__proto__ || Object.getPrototypeOf(RTFoldableTable)).call(this, props, context));

      _this.onResizedChange = function (resized) {
        var onResizedChange = _this.props.onResizedChange;

        if (onResizedChange) onResizedChange(resized);else {
          _this.setState(function (p) {
            return { resized: resized };
          });
        }
      };

      _this.removeResized = function (column) {
        var id = column.id;

        if (!id) return;

        var resized = _this.state.resized;

        if (!resized) return;

        var rs = resized.find(function (r) {
          return r.id === id;
        });
        if (!rs) return;

        var newResized = resized.filter(function (r) {
          return r !== rs;
        });
        _this.onResizedChange(newResized);
      };

      _this.getWrappedInstance = function () {
        if (!_this.wrappedInstance) console.warn('RTFoldableTable - No wrapped instance');
        if (_this.wrappedInstance.getWrappedInstance) return _this.wrappedInstance.getWrappedInstance();
        return _this.wrappedInstance;
      };

      _this.getCopiedKey = function (key) {
        var foldableOriginalKey = _this.props.foldableOriginalKey;

        return '' + foldableOriginalKey + key;
      };

      _this.copyOriginals = function (column) {
        var FoldedColumn = _this.props.FoldedColumn;

        // Stop copy if the column already copied

        if (column.original_Header) return;

        Object.keys(FoldedColumn).forEach(function (k) {
          var copiedKey = _this.getCopiedKey(k);

          if (k === 'Cell') column[copiedKey] = column[k] ? column[k] : function (c) {
            return c.value;
          };else column[copiedKey] = column[k];
        });

        // Copy sub Columns
        if (column.columns && !column.original_Columns) column.original_Columns = column.columns;

        // Copy Header
        if (!column.original_Header) column.original_Header = column.Header;
      };

      _this.restoreToOriginal = function (column) {
        var FoldedColumn = _this.props.FoldedColumn;


        Object.keys(FoldedColumn).forEach(function (k) {
          // ignore header as handling by foldableHeaderRender
          if (k === 'Header') return;

          var copiedKey = _this.getCopiedKey(k);
          column[k] = column[copiedKey];
        });

        if (column.columns && column.original_Columns) column.columns = column.original_Columns;
      };

      _this.getState = function () {
        return _this.props.onFoldChange ? _this.props.folded : _this.state.folded;
      };

      _this.isFolded = function (col) {
        var folded = _this.getState();
        return folded[col.id] === true;
      };

      _this.foldingHandler = function (col) {
        if (!col || !col.id) return;

        var onFoldChange = _this.props.onFoldChange;

        var folded = _this.getState();
        var id = col.id;


        var newFold = Object.assign({}, folded);
        newFold[id] = !newFold[id];

        // Remove the Resized if have
        _this.removeResized(col);

        if (onFoldChange) onFoldChange(newFold);else {
          _this.setState(function (previous) {
            return { folded: newFold };
          });
        }
      };

      _this.foldableHeaderRender = function (cell) {
        var _this$props = _this.props,
            FoldButtonComponent = _this$props.FoldButtonComponent,
            FoldIconComponent = _this$props.FoldIconComponent;
        var column = cell.column;

        var collapsed = _this.isFolded(column);
        var icon = React.createElement(FoldIconComponent, { collapsed: collapsed });
        var onClick = function onClick() {
          return _this.foldingHandler(column);
        };

        return React.createElement(FoldButtonComponent, {
          header: column.original_Header,
          collapsed: collapsed,
          icon: icon,
          onClick: onClick
        });
      };

      _this.applyFoldableForColumn = function (column) {
        var collapsed = _this.isFolded(column);
        var FoldedColumn = _this.props.FoldedColumn;

        // Handle Column Header

        if (column.columns) {
          if (collapsed) {
            column.columns = [FoldedColumn];
            column.width = FoldedColumn.width;
            column.style = FoldedColumn.style;
          } else _this.restoreToOriginal(column);
        }
        // Handle Normal Column.
        else if (collapsed) column = Object.assign(column, FoldedColumn);else {
            _this.restoreToOriginal(column);
          }
      };

      _this.applyFoldableForColumns = function (columns) {
        return columns.map(function (col, index) {
          if (!col.foldable) return col;

          // If col don't have id then generate id based on index
          if (!col.id) col.id = 'col_' + index;

          _this.copyOriginals(col);
          // Replace current header with internal header render.
          col.Header = function (c) {
            return _this.foldableHeaderRender(c);
          };
          // apply foldable
          _this.applyFoldableForColumn(col);

          // return the new column out
          return col;
        });
      };

      _this.state = {
        folded: props.onFoldChange ? undefined : {},
        resized: props.resized || []
      };
      return _this;
    }

    _createClass(RTFoldableTable, [{
      key: 'UNSAFE_componentWillReceiveProps',
      value: function UNSAFE_componentWillReceiveProps(newProps) {
        if (this.state.resized !== newProps.resized) {
          this.setState(function (p) {
            return { resized: newProps.resized };
          });
        }
      }

      // this is so we can expose the underlying ReactTable.

    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
            originalCols = _props.columns,
            FoldButtonComponent = _props.FoldButtonComponent,
            FoldIconComponent = _props.FoldIconComponent,
            FoldedColumn = _props.FoldedColumn,
            rest = _objectWithoutProperties(_props, ['columns', 'FoldButtonComponent', 'FoldIconComponent', 'FoldedColumn']);

        var columns = this.applyFoldableForColumns([].concat(_toConsumableArray(originalCols)));

        var extra = {
          columns: columns,
          onResizedChange: this.onResizedChange,
          resized: this.state.resized
        };

        return React.createElement(ReactTable, _extends({}, rest, extra, { ref: function ref(r) {
            return _this2.wrappedInstance = r;
          } }));
      }
    }]);

    return RTFoldableTable;
  }(React.Component);

  wrapper.displayName = 'RTFoldableTable';
  wrapper.defaultProps = {
    FoldIconComponent: defaultFoldIconComponent,
    FoldButtonComponent: defaultFoldButtonComponent,
    foldableOriginalKey: 'original_',
    FoldedColumn: {
      Cell: function Cell(c) {
        return '';
      },
      width: 30,
      sortable: false,
      resizable: false,
      filterable: false
    }
  };

  return wrapper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvZm9sZGFibGVUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsImxlZnQiLCJyaWdodCIsImRlZmF1bHRGb2xkSWNvbkNvbXBvbmVudCIsImNvbGxhcHNlZCIsInN0eWxlIiwid2lkdGgiLCJkZWZhdWx0Rm9sZEJ1dHRvbkNvbXBvbmVudCIsImhlYWRlciIsImljb24iLCJvbkNsaWNrIiwibWFyZ2luTGVmdCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImZsb2F0IiwiY3Vyc29yIiwid3JhcHBlciIsInByb3BzIiwiY29udGV4dCIsIm9uUmVzaXplZENoYW5nZSIsInJlc2l6ZWQiLCJzZXRTdGF0ZSIsInJlbW92ZVJlc2l6ZWQiLCJpZCIsImNvbHVtbiIsInN0YXRlIiwicnMiLCJmaW5kIiwiciIsIm5ld1Jlc2l6ZWQiLCJmaWx0ZXIiLCJnZXRXcmFwcGVkSW5zdGFuY2UiLCJ3cmFwcGVkSW5zdGFuY2UiLCJjb25zb2xlIiwid2FybiIsImdldENvcGllZEtleSIsImZvbGRhYmxlT3JpZ2luYWxLZXkiLCJrZXkiLCJjb3B5T3JpZ2luYWxzIiwiRm9sZGVkQ29sdW1uIiwib3JpZ2luYWxfSGVhZGVyIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJjb3BpZWRLZXkiLCJrIiwiYyIsInZhbHVlIiwiY29sdW1ucyIsIm9yaWdpbmFsX0NvbHVtbnMiLCJIZWFkZXIiLCJyZXN0b3JlVG9PcmlnaW5hbCIsImdldFN0YXRlIiwib25Gb2xkQ2hhbmdlIiwiZm9sZGVkIiwiaXNGb2xkZWQiLCJjb2wiLCJmb2xkaW5nSGFuZGxlciIsIm5ld0ZvbGQiLCJhc3NpZ24iLCJmb2xkYWJsZUhlYWRlclJlbmRlciIsIkZvbGRCdXR0b25Db21wb25lbnQiLCJGb2xkSWNvbkNvbXBvbmVudCIsImNlbGwiLCJjcmVhdGVFbGVtZW50IiwiYXBwbHlGb2xkYWJsZUZvckNvbHVtbiIsImFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zIiwibWFwIiwiaW5kZXgiLCJmb2xkYWJsZSIsInVuZGVmaW5lZCIsIm5ld1Byb3BzIiwib3JpZ2luYWxDb2xzIiwicmVzdCIsImV4dHJhIiwiQ29tcG9uZW50IiwiZGlzcGxheU5hbWUiLCJkZWZhdWx0UHJvcHMiLCJDZWxsIiwic29ydGFibGUiLCJyZXNpemFibGUiLCJmaWx0ZXJhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBLE9BQU9BLEtBQVAsTUFBa0IsT0FBbEI7QUFDQSxPQUFPQyxJQUFQLE1BQWlCLFlBQWpCO0FBQ0EsT0FBT0MsS0FBUCxNQUFrQixhQUFsQjs7QUFFQSxJQUFNQywyQkFBMkIsU0FBM0JBLHdCQUEyQixPQUFtQjtBQUFBLE1BQWhCQyxTQUFnQixRQUFoQkEsU0FBZ0I7O0FBQ2xELE1BQU1DLFFBQVEsRUFBRUMsT0FBTyxFQUFULEVBQWQ7O0FBRUEsTUFBSUYsU0FBSixFQUFlLE9BQU8sNkJBQUssS0FBS0YsS0FBVixFQUFpQixPQUFPRyxLQUF4QixFQUErQixLQUFJLE9BQW5DLEdBQVA7QUFDZixTQUFPLDZCQUFLLEtBQUtKLElBQVYsRUFBZ0IsT0FBT0ksS0FBdkIsRUFBOEIsS0FBSSxNQUFsQyxHQUFQO0FBQ0QsQ0FMRDs7QUFPQSxJQUFNRSw2QkFBNkIsU0FBN0JBLDBCQUE2QixRQUEwQztBQUFBLE1BQXZDQyxNQUF1QyxTQUF2Q0EsTUFBdUM7QUFBQSxNQUEvQkosU0FBK0IsU0FBL0JBLFNBQStCO0FBQUEsTUFBcEJLLElBQW9CLFNBQXBCQSxJQUFvQjtBQUFBLE1BQWRDLE9BQWMsU0FBZEEsT0FBYzs7QUFDM0UsTUFBTUwsUUFBUTtBQUNaTSxnQkFBWSxLQURBO0FBRVpDLGVBQVcsTUFGQztBQUdaQyxrQkFBYyxNQUhGO0FBSVpDLFdBQU8sTUFKSztBQUtaQyxZQUFRO0FBTEksR0FBZDs7QUFRQSxTQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLE9BQU9WLEtBQVosRUFBbUIsU0FBU0ssT0FBNUI7QUFDR0Q7QUFESCxLQURGO0FBSUcs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LE9BQXBCLEVBQU47QUFBQSxXQUFkO0FBQ0Q7QUFDRjs7QUF3QkQ7O0FBdENJO0FBQUE7QUFBQSwrQkFpS0s7QUFBQTs7QUFBQSxxQkFPSCxLQUFLSCxLQVBGO0FBQUEsWUFFSXVELFlBRkosVUFFTHhCLE9BRks7QUFBQSxZQUdMYSxtQkFISyxVQUdMQSxtQkFISztBQUFBLFlBSUxDLGlCQUpLLFVBSUxBLGlCQUpLO0FBQUEsWUFLTHZCLFlBTEssVUFLTEEsWUFMSztBQUFBLFlBTUZrQyxJQU5FOztBQVFQLFlBQU16QixVQUFVLEtBQUtrQix1QkFBTCw4QkFBaUNNLFlBQWpDLEdBQWhCOztBQUVBLFlBQU1FLFFBQVE7QUFDWjFCLDBCQURZO0FBRVo3QiwyQkFBaUIsS0FBS0EsZUFGVjtBQUdaQyxtQkFBUyxLQUFLSyxLQUFMLENBQVdMO0FBSFIsU0FBZDs7QUFNQSxlQUFPLG9CQUFDLFVBQUQsZUFBZ0JxRCxJQUFoQixFQUEwQkMsS0FBMUIsSUFBaUMsS0FBSztBQUFBLG1CQUFNLE9BQUsxQyxlQUFMLEdBQXVCSixDQUE3QjtBQUFBLFdBQXRDLElBQVA7QUFDRDtBQWxMRzs7QUFBQTtBQUFBLElBQXdDNUIsTUFBTTJFLFNBQTlDLENBQU47O0FBcUxBM0QsVUFBUTRELFdBQVIsR0FBc0IsaUJBQXRCO0FBQ0E1RCxVQUFRNkQsWUFBUixHQUF1QjtBQUNyQmYsdUJBQW1CM0Qsd0JBREU7QUFFckIwRCx5QkFBcUJ0RCwwQkFGQTtBQUdyQjZCLHlCQUFxQixXQUhBO0FBSXJCRyxrQkFBYztBQUNadUMsWUFBTTtBQUFBLGVBQUssRUFBTDtBQUFBLE9BRE07QUFFWnhFLGFBQU8sRUFGSztBQUdaeUUsZ0JBQVUsS0FIRTtBQUlaQyxpQkFBVyxLQUpDO0FBS1pDLGtCQUFZO0FBTEE7QUFKTyxHQUF2Qjs7QUFhQSxTQUFPakUsT0FBUDtBQUNELENBck1EIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGxlZnQgZnJvbSAnLi9sZWZ0LnN2ZydcbmltcG9ydCByaWdodCBmcm9tICcuL3JpZ2h0LnN2ZydcblxuY29uc3QgZGVmYXVsdEZvbGRJY29uQ29tcG9uZW50ID0gKHsgY29sbGFwc2VkIH0pID0+IHtcbiAgY29uc3Qgc3R5bGUgPSB7IHdpZHRoOiAyNSB9XG5cbiAgaWYgKGNvbGxhcHNlZCkgcmV0dXJuIDxpbWcgc3JjPXtyaWdodH0gc3R5bGU9e3N0eWxlfSBhbHQ9XCJyaWdodFwiIC8+XG4gIHJldHVybiA8aW1nIHNyYz17bGVmdH0gc3R5bGU9e3N0eWxlfSBhbHQ9XCJsZWZ0XCIgLz5cbn1cblxuY29uc3QgZGVmYXVsdEZvbGRCdXR0b25Db21wb25lbnQgPSAoeyBoZWFkZXIsIGNvbGxhcHNlZCwgaWNvbiwgb25DbGljayB9KSA9PiB7XG4gIGNvbnN0IHN0eWxlID0ge1xuICAgIG1hcmdpbkxlZnQ6ICcwcHgnLFxuICAgIG1hcmdpblRvcDogJy01cHgnLFxuICAgIG1hcmdpbkJvdHRvbTogJy04cHgnLFxuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0gb25DbGljaz17b25DbGlja30+XG4gICAgICAgIHtpY29ufVxuICAgICAgPC9kaXY+XG4gICAgICB7IWNvbGxhcHNlZCAmJiA8ZGl2PntoZWFkZXJ9PC9kaXY+fVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0VGFibGUgPT4ge1xuICBjb25zdCB3cmFwcGVyID0gY2xhc3MgUlRGb2xkYWJsZVRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpXG5cbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIGZvbGRlZDogcHJvcHMub25Gb2xkQ2hhbmdlID8gdW5kZWZpbmVkIDoge30sXG4gICAgICAgIHJlc2l6ZWQ6IHByb3BzLnJlc2l6ZWQgfHwgW10sXG4gICAgICB9XG4gICAgfVxuXG4gICAgVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV3UHJvcHMpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnJlc2l6ZWQgIT09IG5ld1Byb3BzLnJlc2l6ZWQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwID0+ICh7IHJlc2l6ZWQ6IG5ld1Byb3BzLnJlc2l6ZWQgfSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgb25SZXNpemVkQ2hhbmdlID0gcmVzaXplZCA9PiB7XG4gICAgICBjb25zdCB7IG9uUmVzaXplZENoYW5nZSB9ID0gdGhpcy5wcm9wc1xuICAgICAgaWYgKG9uUmVzaXplZENoYW5nZSkgb25SZXNpemVkQ2hhbmdlKHJlc2l6ZWQpXG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwID0+ICh7IHJlc2l6ZWQgfSkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlUmVzaXplZCA9IGNvbHVtbiA9PiB7XG4gICAgICBjb25zdCB7IGlkIH0gPSBjb2x1bW5cbiAgICAgIGlmICghaWQpIHJldHVyblxuXG4gICAgICBjb25zdCB7IHJlc2l6ZWQgfSA9IHRoaXMuc3RhdGVcbiAgICAgIGlmICghcmVzaXplZCkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHJzID0gcmVzaXplZC5maW5kKHIgPT4gci5pZCA9PT0gaWQpXG4gICAgICBpZiAoIXJzKSByZXR1cm5cblxuICAgICAgY29uc3QgbmV3UmVzaXplZCA9IHJlc2l6ZWQuZmlsdGVyKHIgPT4gciAhPT0gcnMpXG4gICAgICB0aGlzLm9uUmVzaXplZENoYW5nZShuZXdSZXNpemVkKVxuICAgIH1cblxuICAgIC8vIHRoaXMgaXMgc28gd2UgY2FuIGV4cG9zZSB0aGUgdW5kZXJseWluZyBSZWFjdFRhYmxlLlxuICAgIGdldFdyYXBwZWRJbnN0YW5jZSA9ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIGNvbnNvbGUud2FybignUlRGb2xkYWJsZVRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpXG4gICAgICBpZiAodGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKSByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2UuZ2V0V3JhcHBlZEluc3RhbmNlKClcbiAgICAgIHJldHVybiB0aGlzLndyYXBwZWRJbnN0YW5jZVxuICAgIH1cblxuICAgIGdldENvcGllZEtleSA9IGtleSA9PiB7XG4gICAgICBjb25zdCB7IGZvbGRhYmxlT3JpZ2luYWxLZXkgfSA9IHRoaXMucHJvcHNcbiAgICAgIHJldHVybiBgJHtmb2xkYWJsZU9yaWdpbmFsS2V5fSR7a2V5fWBcbiAgICB9XG5cbiAgICBjb3B5T3JpZ2luYWxzID0gY29sdW1uID0+IHtcbiAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzXG5cbiAgICAgIC8vIFN0b3AgY29weSBpZiB0aGUgY29sdW1uIGFscmVhZHkgY29waWVkXG4gICAgICBpZiAoY29sdW1uLm9yaWdpbmFsX0hlYWRlcikgcmV0dXJuXG5cbiAgICAgIE9iamVjdC5rZXlzKEZvbGRlZENvbHVtbikuZm9yRWFjaChrID0+IHtcbiAgICAgICAgY29uc3QgY29waWVkS2V5ID0gdGhpcy5nZXRDb3BpZWRLZXkoaylcblxuICAgICAgICBpZiAoayA9PT0gJ0NlbGwnKSBjb2x1bW5bY29waWVkS2V5XSA9IGNvbHVtbltrXSA/IGNvbHVtbltrXSA6IGMgPT4gYy52YWx1ZVxuICAgICAgICBlbHNlIGNvbHVtbltjb3BpZWRLZXldID0gY29sdW1uW2tdXG4gICAgICB9KVxuXG4gICAgICAvLyBDb3B5IHN1YiBDb2x1bW5zXG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMgJiYgIWNvbHVtbi5vcmlnaW5hbF9Db2x1bW5zKSBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucyA9IGNvbHVtbi5jb2x1bW5zXG5cbiAgICAgIC8vIENvcHkgSGVhZGVyXG4gICAgICBpZiAoIWNvbHVtbi5vcmlnaW5hbF9IZWFkZXIpIGNvbHVtbi5vcmlnaW5hbF9IZWFkZXIgPSBjb2x1bW4uSGVhZGVyXG4gICAgfVxuXG4gICAgcmVzdG9yZVRvT3JpZ2luYWwgPSBjb2x1bW4gPT4ge1xuICAgICAgY29uc3QgeyBGb2xkZWRDb2x1bW4gfSA9IHRoaXMucHJvcHNcblxuICAgICAgT2JqZWN0LmtleXMoRm9sZGVkQ29sdW1uKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICAvLyBpZ25vcmUgaGVhZGVyIGFzIGhhbmRsaW5nIGJ5IGZvbGRhYmxlSGVhZGVyUmVuZGVyXG4gICAgICAgIGlmIChrID09PSAnSGVhZGVyJykgcmV0dXJuXG5cbiAgICAgICAgY29uc3QgY29waWVkS2V5ID0gdGhpcy5nZXRDb3BpZWRLZXkoaylcbiAgICAgICAgY29sdW1uW2tdID0gY29sdW1uW2NvcGllZEtleV1cbiAgICAgIH0pXG5cbiAgICAgIGlmIChjb2x1bW4uY29sdW1ucyAmJiBjb2x1bW4ub3JpZ2luYWxfQ29sdW1ucykgY29sdW1uLmNvbHVtbnMgPSBjb2x1bW4ub3JpZ2luYWxfQ29sdW1uc1xuICAgIH1cblxuICAgIGdldFN0YXRlID0gKCkgPT4gKHRoaXMucHJvcHMub25Gb2xkQ2hhbmdlID8gdGhpcy5wcm9wcy5mb2xkZWQgOiB0aGlzLnN0YXRlLmZvbGRlZClcblxuICAgIGlzRm9sZGVkID0gY29sID0+IHtcbiAgICAgIGNvbnN0IGZvbGRlZCA9IHRoaXMuZ2V0U3RhdGUoKVxuICAgICAgcmV0dXJuIGZvbGRlZFtjb2wuaWRdID09PSB0cnVlXG4gICAgfVxuXG4gICAgZm9sZGluZ0hhbmRsZXIgPSBjb2wgPT4ge1xuICAgICAgaWYgKCFjb2wgfHwgIWNvbC5pZCkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHsgb25Gb2xkQ2hhbmdlIH0gPSB0aGlzLnByb3BzXG4gICAgICBjb25zdCBmb2xkZWQgPSB0aGlzLmdldFN0YXRlKClcbiAgICAgIGNvbnN0IHsgaWQgfSA9IGNvbFxuXG4gICAgICBjb25zdCBuZXdGb2xkID0gT2JqZWN0LmFzc2lnbih7fSwgZm9sZGVkKVxuICAgICAgbmV3Rm9sZFtpZF0gPSAhbmV3Rm9sZFtpZF1cblxuICAgICAgLy8gUmVtb3ZlIHRoZSBSZXNpemVkIGlmIGhhdmVcbiAgICAgIHRoaXMucmVtb3ZlUmVzaXplZChjb2wpXG5cbiAgICAgIGlmIChvbkZvbGRDaGFuZ2UpIG9uRm9sZENoYW5nZShuZXdGb2xkKVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldmlvdXMgPT4gKHsgZm9sZGVkOiBuZXdGb2xkIH0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvbGRhYmxlSGVhZGVyUmVuZGVyID0gY2VsbCA9PiB7XG4gICAgICBjb25zdCB7IEZvbGRCdXR0b25Db21wb25lbnQsIEZvbGRJY29uQ29tcG9uZW50IH0gPSB0aGlzLnByb3BzXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gY2VsbFxuICAgICAgY29uc3QgY29sbGFwc2VkID0gdGhpcy5pc0ZvbGRlZChjb2x1bW4pXG4gICAgICBjb25zdCBpY29uID0gUmVhY3QuY3JlYXRlRWxlbWVudChGb2xkSWNvbkNvbXBvbmVudCwgeyBjb2xsYXBzZWQgfSlcbiAgICAgIGNvbnN0IG9uQ2xpY2sgPSAoKSA9PiB0aGlzLmZvbGRpbmdIYW5kbGVyKGNvbHVtbilcblxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9sZEJ1dHRvbkNvbXBvbmVudCwge1xuICAgICAgICBoZWFkZXI6IGNvbHVtbi5vcmlnaW5hbF9IZWFkZXIsXG4gICAgICAgIGNvbGxhcHNlZCxcbiAgICAgICAgaWNvbixcbiAgICAgICAgb25DbGljayxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgYXBwbHlGb2xkYWJsZUZvckNvbHVtbiA9IGNvbHVtbiA9PiB7XG4gICAgICBjb25zdCBjb2xsYXBzZWQgPSB0aGlzLmlzRm9sZGVkKGNvbHVtbilcbiAgICAgIGNvbnN0IHsgRm9sZGVkQ29sdW1uIH0gPSB0aGlzLnByb3BzXG5cbiAgICAgIC8vIEhhbmRsZSBDb2x1bW4gSGVhZGVyXG4gICAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xuICAgICAgICAgIGNvbHVtbi5jb2x1bW5zID0gW0ZvbGRlZENvbHVtbl1cbiAgICAgICAgICBjb2x1bW4ud2lkdGggPSBGb2xkZWRDb2x1bW4ud2lkdGhcbiAgICAgICAgICBjb2x1bW4uc3R5bGUgPSBGb2xkZWRDb2x1bW4uc3R5bGVcbiAgICAgICAgfSBlbHNlIHRoaXMucmVzdG9yZVRvT3JpZ2luYWwoY29sdW1uKVxuICAgICAgfVxuICAgICAgLy8gSGFuZGxlIE5vcm1hbCBDb2x1bW4uXG4gICAgICBlbHNlIGlmIChjb2xsYXBzZWQpIGNvbHVtbiA9IE9iamVjdC5hc3NpZ24oY29sdW1uLCBGb2xkZWRDb2x1bW4pXG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXN0b3JlVG9PcmlnaW5hbChjb2x1bW4pXG4gICAgICB9XG4gICAgfVxuXG4gICAgYXBwbHlGb2xkYWJsZUZvckNvbHVtbnMgPSBjb2x1bW5zID0+XG4gICAgICBjb2x1bW5zLm1hcCgoY29sLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoIWNvbC5mb2xkYWJsZSkgcmV0dXJuIGNvbFxuXG4gICAgICAgIC8vIElmIGNvbCBkb24ndCBoYXZlIGlkIHRoZW4gZ2VuZXJhdGUgaWQgYmFzZWQgb24gaW5kZXhcbiAgICAgICAgaWYgKCFjb2wuaWQpIGNvbC5pZCA9IGBjb2xfJHtpbmRleH1gXG5cbiAgICAgICAgdGhpcy5jb3B5T3JpZ2luYWxzKGNvbClcbiAgICAgICAgLy8gUmVwbGFjZSBjdXJyZW50IGhlYWRlciB3aXRoIGludGVybmFsIGhlYWRlciByZW5kZXIuXG4gICAgICAgIGNvbC5IZWFkZXIgPSBjID0+IHRoaXMuZm9sZGFibGVIZWFkZXJSZW5kZXIoYylcbiAgICAgICAgLy8gYXBwbHkgZm9sZGFibGVcbiAgICAgICAgdGhpcy5hcHBseUZvbGRhYmxlRm9yQ29sdW1uKGNvbClcblxuICAgICAgICAvLyByZXR1cm4gdGhlIG5ldyBjb2x1bW4gb3V0XG4gICAgICAgIHJldHVybiBjb2xcbiAgICAgIH0pXG5cbiAgICByZW5kZXIoKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNvbHVtbnM6IG9yaWdpbmFsQ29scyxcbiAgICAgICAgRm9sZEJ1dHRvbkNvbXBvbmVudCxcbiAgICAgICAgRm9sZEljb25Db21wb25lbnQsXG4gICAgICAgIEZvbGRlZENvbHVtbixcbiAgICAgICAgLi4ucmVzdFxuICAgICAgfSA9IHRoaXMucHJvcHNcbiAgICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmFwcGx5Rm9sZGFibGVGb3JDb2x1bW5zKFsuLi5vcmlnaW5hbENvbHNdKVxuXG4gICAgICBjb25zdCBleHRyYSA9IHtcbiAgICAgICAgY29sdW1ucyxcbiAgICAgICAgb25SZXNpemVkQ2hhbmdlOiB0aGlzLm9uUmVzaXplZENoYW5nZSxcbiAgICAgICAgcmVzaXplZDogdGhpcy5zdGF0ZS5yZXNpemVkLFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gPFJlYWN0VGFibGUgey4uLnJlc3R9IHsuLi5leHRyYX0gcmVmPXtyID0+ICh0aGlzLndyYXBwZWRJbnN0YW5jZSA9IHIpfSAvPlxuICAgIH1cbiAgfVxuXG4gIHdyYXBwZXIuZGlzcGxheU5hbWUgPSAnUlRGb2xkYWJsZVRhYmxlJ1xuICB3cmFwcGVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgICBGb2xkSWNvbkNvbXBvbmVudDogZGVmYXVsdEZvbGRJY29uQ29tcG9uZW50LFxuICAgIEZvbGRCdXR0b25Db21wb25lbnQ6IGRlZmF1bHRGb2xkQnV0dG9uQ29tcG9uZW50LFxuICAgIGZvbGRhYmxlT3JpZ2luYWxLZXk6ICdvcmlnaW5hbF8nLFxuICAgIEZvbGRlZENvbHVtbjoge1xuICAgICAgQ2VsbDogYyA9PiAnJyxcbiAgICAgIHdpZHRoOiAzMCxcbiAgICAgIHNvcnRhYmxlOiBmYWxzZSxcbiAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICBmaWx0ZXJhYmxlOiBmYWxzZSxcbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIHdyYXBwZXJcbn1cbiJdfQ==