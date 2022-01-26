var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import set from 'lodash.set';
import get from 'lodash.get';

/*
  AvancedExpandTableHOC for ReactTable

  HOC which allows any Cell in the row to toggle the row's
  SubComponent. Also allows the SubComponent to toggle itself.

  Expand functions available to any SubComponent or Column Cell:
    toggleRowSubComponent
    showRowSubComponent
    hideRowSubComponent

  Each Column Renderer (E.g. Cell ) gets the expand functions in its props
  And Each SubComponent gets the expand functions in its props

  Expand functions takes the `rowInfo` given to each
  Column Renderer and SubComponent already by ReactTable.
*/

export var subComponentWithToggle = function subComponentWithToggle(SubComponent, expandFuncs) {
  return function (props) {
    return React.createElement(SubComponent, _extends({}, props, expandFuncs));
  };
};

// each cell in the column gets passed the function to toggle a sub component
export var columnsWithToggle = function columnsWithToggle(columns, expandFuncs) {
  return columns.map(function (column) {
    if (column.columns) {
      return _extends({}, column, {
        columns: columnsWithToggle(column.columns, expandFuncs)
      });
    }
    return _extends({}, column, {
      getProps: function getProps() {
        return _extends({}, expandFuncs);
      }
    });
  });
};

var advancedExpandTableHOC = function advancedExpandTableHOC(TableComponent) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(AdvancedExpandTable, _Component);

    function AdvancedExpandTable(props) {
      _classCallCheck(this, AdvancedExpandTable);

      var _this = _possibleConstructorReturn(this, (AdvancedExpandTable.__proto__ || Object.getPrototypeOf(AdvancedExpandTable)).call(this, props));

      _this.state = {
        expanded: {}
      };
      _this.toggleRowSubComponent = _this.toggleRowSubComponent.bind(_this);
      _this.showRowSubComponent = _this.showRowSubComponent.bind(_this);
      _this.hideRowSubComponent = _this.hideRowSubComponent.bind(_this);
      _this.getTdProps = _this.getTdProps.bind(_this);
      _this.fireOnExpandedChange = _this.fireOnExpandedChange.bind(_this);
      _this.expandFuncs = {
        toggleRowSubComponent: _this.toggleRowSubComponent,
        showRowSubComponent: _this.showRowSubComponent,
        hideRowSubComponent: _this.hideRowSubComponent
      };
      return _this;
    }

    // after initial render if we get new
    // data, columns, page changes, etc.
    // we reset expanded state.


    _createClass(AdvancedExpandTable, [{
      key: 'UNSAFE_componentWillReceiveProps',
      value: function UNSAFE_componentWillReceiveProps() {
        this.setState({
          expanded: {}
        });
      }
    }, {
      key: 'fireOnExpandedChange',
      value: function fireOnExpandedChange(rowInfo, e) {
        // fire callback once state has changed.
        if (this.props.onExpandedChange) {
          this.props.onExpandedChange(rowInfo, e);
        }
      }
    }, {
      key: 'resolveNewTableState',
      value: function resolveNewTableState(rowInfoOrNestingPath, e, expandType) {
        var _this2 = this;

        // derive nestingPath if only rowInfo is passed
        var nestingPath = rowInfoOrNestingPath;

        if (rowInfoOrNestingPath.nestingPath) {
          nestingPath = rowInfoOrNestingPath.nestingPath;
        }

        this.setState(function (prevState) {
          var isExpanded = get(prevState.expanded, nestingPath);
          // since we do not support nested rows, a shallow clone is okay.
          var newExpanded = _extends({}, prevState.expanded);

          switch (expandType) {
            case 'show':
              set(newExpanded, nestingPath, {});
              break;
            case 'hide':
              set(newExpanded, nestingPath, false);
              break;
            default:
              // toggle
              set(newExpanded, nestingPath, isExpanded ? false : {});
          }
          return _extends({}, prevState, {
            expanded: newExpanded
          });
        }, function () {
          return _this2.fireOnExpandedChange(rowInfoOrNestingPath, e);
        });
      }
    }, {
      key: 'toggleRowSubComponent',
      value: function toggleRowSubComponent(rowInfo, e) {
        this.resolveNewTableState(rowInfo, e);
      }
    }, {
      key: 'showRowSubComponent',
      value: function showRowSubComponent(rowInfo, e) {
        this.resolveNewTableState(rowInfo, e, 'show');
      }
    }, {
      key: 'hideRowSubComponent',
      value: function hideRowSubComponent(rowInfo, e) {
        this.resolveNewTableState(rowInfo, e, 'hide');
      }
    }, {
      key: 'getTdProps',
      value: function getTdProps(tableState, rowInfo, column) {
        var _this3 = this;

        var expander = column.expander;


        if (!expander) {
          // no overrides
          return {};
        }

        return {
          // only override onClick for column Td
          onClick: function onClick(e) {
            _this3.toggleRowSubComponent(rowInfo, e);
          }
        };
      }
    }, {
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        if (!this.wrappedInstance) {
          console.warn('AdvancedExpandTable - No wrapped instance');
        }
        if (this.wrappedInstance.getWrappedInstance) {
          return this.wrappedInstance.getWrappedInstance();
        }
        return this.wrappedInstance;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            columns = _props.columns,
            SubComponent = _props.SubComponent,
            onExpandedChange = _props.onExpandedChange,
            rest = _objectWithoutProperties(_props, ['columns', 'SubComponent', 'onExpandedChange']);

        var wrappedColumns = columnsWithToggle(columns, this.expandFuncs);
        var WrappedSubComponent = subComponentWithToggle(SubComponent, this.expandFuncs);

        return React.createElement(TableComponent, _extends({}, rest, {
          columns: wrappedColumns,
          expanded: this.state.expanded,
          getTdProps: this.getTdProps,
          SubComponent: WrappedSubComponent,
          TdComponent: AdvancedExpandTable.TdComponent
        }));
      }
    }], [{
      key: 'TdComponent',


      // since we pass the expand functions to each Cell,
      // we need to filter it out from being passed as an
      // actual DOM attribute. See getProps in columnsWithToggle above.
      value: function TdComponent(_ref) {
        var toggleRowSubComponent = _ref.toggleRowSubComponent,
            showRowSubComponent = _ref.showRowSubComponent,
            hideRowSubComponent = _ref.hideRowSubComponent,
            rest = _objectWithoutProperties(_ref, ['toggleRowSubComponent', 'showRowSubComponent', 'hideRowSubComponent']);

        return React.createElement(TableComponent.defaultProps.TdComponent, rest);
      }
    }]);

    return AdvancedExpandTable;
  }(Component), _class.propTypes = {
    columns: PropTypes.array.isRequired,
    SubComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
    onExpandedChange: PropTypes.func
  }, _class.defaultProps = {
    onExpandedChange: null
  }, _class.DisplayName = 'AdvancedExpandTable', _temp;
};
export { advancedExpandTableHOC };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob2MvYWR2YW5jZWRFeHBhbmRUYWJsZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkNvbXBvbmVudCIsIlByb3BUeXBlcyIsInNldCIsImdldCIsInN1YkNvbXBvbmVudFdpdGhUb2dnbGUiLCJTdWJDb21wb25lbnQiLCJleHBhbmRGdW5jcyIsInByb3BzIiwiY29sdW1uc1dpdGhUb2dnbGUiLCJjb2x1bW5zIiwibWFwIiwiY29sdW1uIiwiZ2V0UHJvcHMiLCJhZHZhbmNlZEV4cGFuZFRhYmxlSE9DIiwic3RhdGUiLCJleHBhbmRlZCIsInRvZ2dsZVJvd1N1YkNvbXBvbmVudCIsImJpbmQiLCJzaG93Um93U3ViQ29tcG9uZW50IiwiaGlkZVJvd1N1YkNvbXBvbmVudCIsImdldFRkUHJvcHMiLCJmaXJlT25FeHBhbmRlZENoYW5nZSIsInNldFN0YXRlIiwicm93SW5mbyIsImUiLCJvbkV4cGFuZGVkQ2hhbmdlIiwicm93SW5mb09yTmVzdGluZ1BhdGgiLCJleHBhbmRUeXBlIiwibmVzdGluZ1BhdGgiLCJpc0V4cGFuZGVkIiwicHJldlN0YXRlIiwibmV3RXhwYW5kZWQiLCJyZXNvbHZlTmV3VGFibGVTdGF0ZSIsInRhYmxlU3RhdGUiLCJleHBhbmRlciIsIm9uQ2xpY2siLCJ3cmFwcGVkSW5zdGFuY2UiLCJjb25zb2xlIiwid2FybiIsImdldFdyYXBwZWRJbnN0YW5jZSIsInJlc3QiLCJ3cmFwcGVkQ29sdW1ucyIsIldyYXBwZWRTdWJDb21wb25lbnQiLCJBZHZhbmNlZEV4cGFuZFRhYmxlIiwiVGRDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJhcnJheSIsImlzUmVxdWlyZWQiLCJvbmVPZlR5cGUiLCJmdW5jIiwiZWxlbWVudCIsImRlZmF1bHRQcm9wcyIsIkRpc3BsYXlOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxPQUFPQSxLQUFQLElBQWdCQyxTQUFoQixRQUFpQyxPQUFqQztBQUNBLE9BQU9DLFNBQVAs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QUFrQnhCLFVBQVVnRDtBQUpYLEdBNUJlLFNBbUMzQkUsWUFuQzJCLEdBbUNaO0FBQ3BCMUIsc0JBQWtCO0FBREUsR0FuQ1ksU0F1QzNCMkIsV0F2QzJCLEdBdUNiLHFCQXZDYTtBQUFBLENBQS9CIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0IHNldCBmcm9tICdsb2Rhc2guc2V0J1xuaW1wb3J0IGdldCBmcm9tICdsb2Rhc2guZ2V0J1xuXG4vKlxuICBBdmFuY2VkRXhwYW5kVGFibGVIT0MgZm9yIFJlYWN0VGFibGVcblxuICBIT0Mgd2hpY2ggYWxsb3dzIGFueSBDZWxsIGluIHRoZSByb3cgdG8gdG9nZ2xlIHRoZSByb3cnc1xuICBTdWJDb21wb25lbnQuIEFsc28gYWxsb3dzIHRoZSBTdWJDb21wb25lbnQgdG8gdG9nZ2xlIGl0c2VsZi5cblxuICBFeHBhbmQgZnVuY3Rpb25zIGF2YWlsYWJsZSB0byBhbnkgU3ViQ29tcG9uZW50IG9yIENvbHVtbiBDZWxsOlxuICAgIHRvZ2dsZVJvd1N1YkNvbXBvbmVudFxuICAgIHNob3dSb3dTdWJDb21wb25lbnRcbiAgICBoaWRlUm93U3ViQ29tcG9uZW50XG5cbiAgRWFjaCBDb2x1bW4gUmVuZGVyZXIgKEUuZy4gQ2VsbCApIGdldHMgdGhlIGV4cGFuZCBmdW5jdGlvbnMgaW4gaXRzIHByb3BzXG4gIEFuZCBFYWNoIFN1YkNvbXBvbmVudCBnZXRzIHRoZSBleHBhbmQgZnVuY3Rpb25zIGluIGl0cyBwcm9wc1xuXG4gIEV4cGFuZCBmdW5jdGlvbnMgdGFrZXMgdGhlIGByb3dJbmZvYCBnaXZlbiB0byBlYWNoXG4gIENvbHVtbiBSZW5kZXJlciBhbmQgU3ViQ29tcG9uZW50IGFscmVhZHkgYnkgUmVhY3RUYWJsZS5cbiovXG5cbmV4cG9ydCBjb25zdCBzdWJDb21wb25lbnRXaXRoVG9nZ2xlID0gKFN1YkNvbXBvbmVudCwgZXhwYW5kRnVuY3MpID0+IHByb3BzID0+IChcbiAgPFN1YkNvbXBvbmVudCB7Li4ucHJvcHN9IHsuLi5leHBhbmRGdW5jc30gLz5cbilcblxuLy8gZWFjaCBjZWxsIGluIHRoZSBjb2x1bW4gZ2V0cyBwYXNzZWQgdGhlIGZ1bmN0aW9uIHRvIHRvZ2dsZSBhIHN1YiBjb21wb25lbnRcbmV4cG9ydCBjb25zdCBjb2x1bW5zV2l0aFRvZ2dsZSA9IChjb2x1bW5zLCBleHBhbmRGdW5jcykgPT5cbiAgY29sdW1ucy5tYXAoY29sdW1uID0+IHtcbiAgICBpZiAoY29sdW1uLmNvbHVtbnMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmNvbHVtbixcbiAgICAgICAgY29sdW1uczogY29sdW1uc1dpdGhUb2dnbGUoY29sdW1uLmNvbHVtbnMsIGV4cGFuZEZ1bmNzKSxcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmNvbHVtbixcbiAgICAgIGdldFByb3BzICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5leHBhbmRGdW5jcyxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0pXG5cbmV4cG9ydCBjb25zdCBhZHZhbmNlZEV4cGFuZFRhYmxlSE9DID0gVGFibGVDb21wb25lbnQgPT5cbiAgY2xhc3MgQWR2YW5jZWRFeHBhbmRUYWJsZSBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgICBzdXBlcihwcm9wcylcbiAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgIGV4cGFuZGVkOiB7fSxcbiAgICAgIH1cbiAgICAgIHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50ID0gdGhpcy50b2dnbGVSb3dTdWJDb21wb25lbnQuYmluZCh0aGlzKVxuICAgICAgdGhpcy5zaG93Um93U3ViQ29tcG9uZW50ID0gdGhpcy5zaG93Um93U3ViQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgIHRoaXMuaGlkZVJvd1N1YkNvbXBvbmVudCA9IHRoaXMuaGlkZVJvd1N1YkNvbXBvbmVudC5iaW5kKHRoaXMpXG4gICAgICB0aGlzLmdldFRkUHJvcHMgPSB0aGlzLmdldFRkUHJvcHMuYmluZCh0aGlzKVxuICAgICAgdGhpcy5maXJlT25FeHBhbmRlZENoYW5nZSA9IHRoaXMuZmlyZU9uRXhwYW5kZWRDaGFuZ2UuYmluZCh0aGlzKVxuICAgICAgdGhpcy5leHBhbmRGdW5jcyA9IHtcbiAgICAgICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50OiB0aGlzLnRvZ2dsZVJvd1N1YkNvbXBvbmVudCxcbiAgICAgICAgc2hvd1Jvd1N1YkNvbXBvbmVudDogdGhpcy5zaG93Um93U3ViQ29tcG9uZW50LFxuICAgICAgICBoaWRlUm93U3ViQ29tcG9uZW50OiB0aGlzLmhpZGVSb3dTdWJDb21wb25lbnQsXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWZ0ZXIgaW5pdGlhbCByZW5kZXIgaWYgd2UgZ2V0IG5ld1xuICAgIC8vIGRhdGEsIGNvbHVtbnMsIHBhZ2UgY2hhbmdlcywgZXRjLlxuICAgIC8vIHdlIHJlc2V0IGV4cGFuZGVkIHN0YXRlLlxuICAgIFVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzICgpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBleHBhbmRlZDoge30sXG4gICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgICBjb2x1bW5zOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICAgIFN1YkNvbXBvbmVudDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLmZ1bmMsIFByb3BUeXBlcy5lbGVtZW50XSlcbiAgICAgICAgLmlzUmVxdWlyZWQsXG4gICAgICBvbkV4cGFuZGVkQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB9O1xuXG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIG9uRXhwYW5kZWRDaGFuZ2U6IG51bGwsXG4gICAgfTtcblxuICAgIHN0YXRpYyBEaXNwbGF5TmFtZSA9ICdBZHZhbmNlZEV4cGFuZFRhYmxlJztcblxuICAgIC8vIHNpbmNlIHdlIHBhc3MgdGhlIGV4cGFuZCBmdW5jdGlvbnMgdG8gZWFjaCBDZWxsLFxuICAgIC8vIHdlIG5lZWQgdG8gZmlsdGVyIGl0IG91dCBmcm9tIGJlaW5nIHBhc3NlZCBhcyBhblxuICAgIC8vIGFjdHVhbCBET00gYXR0cmlidXRlLiBTZWUgZ2V0UHJvcHMgaW4gY29sdW1uc1dpdGhUb2dnbGUgYWJvdmUuXG4gICAgc3RhdGljIFRkQ29tcG9uZW50ICh7XG4gICAgICB0b2dnbGVSb3dTdWJDb21wb25lbnQsXG4gICAgICBzaG93Um93U3ViQ29tcG9uZW50LFxuICAgICAgaGlkZVJvd1N1YkNvbXBvbmVudCxcbiAgICAgIC4uLnJlc3RcbiAgICB9KSB7XG4gICAgICByZXR1cm4gPFRhYmxlQ29tcG9uZW50LmRlZmF1bHRQcm9wcy5UZENvbXBvbmVudCB7Li4ucmVzdH0gLz5cbiAgICB9XG5cbiAgICBmaXJlT25FeHBhbmRlZENoYW5nZSAocm93SW5mbywgZSkge1xuICAgICAgLy8gZmlyZSBjYWxsYmFjayBvbmNlIHN0YXRlIGhhcyBjaGFuZ2VkLlxuICAgICAgaWYgKHRoaXMucHJvcHMub25FeHBhbmRlZENoYW5nZSkge1xuICAgICAgICB0aGlzLnByb3BzLm9uRXhwYW5kZWRDaGFuZ2Uocm93SW5mbywgZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXNvbHZlTmV3VGFibGVTdGF0ZSAocm93SW5mb09yTmVzdGluZ1BhdGgsIGUsIGV4cGFuZFR5cGUpIHtcbiAgICAgIC8vIGRlcml2ZSBuZXN0aW5nUGF0aCBpZiBvbmx5IHJvd0luZm8gaXMgcGFzc2VkXG4gICAgICBsZXQgbmVzdGluZ1BhdGggPSByb3dJbmZvT3JOZXN0aW5nUGF0aFxuXG4gICAgICBpZiAocm93SW5mb09yTmVzdGluZ1BhdGgubmVzdGluZ1BhdGgpIHtcbiAgICAgICAgbmVzdGluZ1BhdGggPSByb3dJbmZvT3JOZXN0aW5nUGF0aC5uZXN0aW5nUGF0aFxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKFxuICAgICAgICBwcmV2U3RhdGUgPT4ge1xuICAgICAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSBnZXQocHJldlN0YXRlLmV4cGFuZGVkLCBuZXN0aW5nUGF0aClcbiAgICAgICAgICAvLyBzaW5jZSB3ZSBkbyBub3Qgc3VwcG9ydCBuZXN0ZWQgcm93cywgYSBzaGFsbG93IGNsb25lIGlzIG9rYXkuXG4gICAgICAgICAgY29uc3QgbmV3RXhwYW5kZWQgPSB7IC4uLnByZXZTdGF0ZS5leHBhbmRlZCB9XG5cbiAgICAgICAgICBzd2l0Y2ggKGV4cGFuZFR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Nob3cnOlxuICAgICAgICAgICAgICBzZXQobmV3RXhwYW5kZWQsIG5lc3RpbmdQYXRoLCB7fSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2hpZGUnOlxuICAgICAgICAgICAgICBzZXQobmV3RXhwYW5kZWQsIG5lc3RpbmdQYXRoLCBmYWxzZSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIC8vIHRvZ2dsZVxuICAgICAgICAgICAgICBzZXQobmV3RXhwYW5kZWQsIG5lc3RpbmdQYXRoLCBpc0V4cGFuZGVkID8gZmFsc2UgOiB7fSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnByZXZTdGF0ZSxcbiAgICAgICAgICAgIGV4cGFuZGVkOiBuZXdFeHBhbmRlZCxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHRoaXMuZmlyZU9uRXhwYW5kZWRDaGFuZ2Uocm93SW5mb09yTmVzdGluZ1BhdGgsIGUpXG4gICAgICApXG4gICAgfVxuXG4gICAgdG9nZ2xlUm93U3ViQ29tcG9uZW50IChyb3dJbmZvLCBlKSB7XG4gICAgICB0aGlzLnJlc29sdmVOZXdUYWJsZVN0YXRlKHJvd0luZm8sIGUpXG4gICAgfVxuXG4gICAgc2hvd1Jvd1N1YkNvbXBvbmVudCAocm93SW5mbywgZSkge1xuICAgICAgdGhpcy5yZXNvbHZlTmV3VGFibGVTdGF0ZShyb3dJbmZvLCBlLCAnc2hvdycpXG4gICAgfVxuXG4gICAgaGlkZVJvd1N1YkNvbXBvbmVudCAocm93SW5mbywgZSkge1xuICAgICAgdGhpcy5yZXNvbHZlTmV3VGFibGVTdGF0ZShyb3dJbmZvLCBlLCAnaGlkZScpXG4gICAgfVxuXG4gICAgZ2V0VGRQcm9wcyAodGFibGVTdGF0ZSwgcm93SW5mbywgY29sdW1uKSB7XG4gICAgICBjb25zdCB7IGV4cGFuZGVyIH0gPSBjb2x1bW5cblxuICAgICAgaWYgKCFleHBhbmRlcikge1xuICAgICAgICAvLyBubyBvdmVycmlkZXNcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIG9ubHkgb3ZlcnJpZGUgb25DbGljayBmb3IgY29sdW1uIFRkXG4gICAgICAgIG9uQ2xpY2s6IGUgPT4ge1xuICAgICAgICAgIHRoaXMudG9nZ2xlUm93U3ViQ29tcG9uZW50KHJvd0luZm8sIGUpXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2V0V3JhcHBlZEluc3RhbmNlICgpIHtcbiAgICAgIGlmICghdGhpcy53cmFwcGVkSW5zdGFuY2UpIHsgY29uc29sZS53YXJuKCdBZHZhbmNlZEV4cGFuZFRhYmxlIC0gTm8gd3JhcHBlZCBpbnN0YW5jZScpIH1cbiAgICAgIGlmICh0aGlzLndyYXBwZWRJbnN0YW5jZS5nZXRXcmFwcGVkSW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud3JhcHBlZEluc3RhbmNlLmdldFdyYXBwZWRJbnN0YW5jZSgpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5zdGFuY2VcbiAgICB9XG5cbiAgICByZW5kZXIgKCkge1xuICAgICAgY29uc3Qge1xuICAgICAgICBjb2x1bW5zLCBTdWJDb21wb25lbnQsIG9uRXhwYW5kZWRDaGFuZ2UsIC4uLnJlc3RcbiAgICAgIH0gPSB0aGlzLnByb3BzXG5cbiAgICAgIGNvbnN0IHdyYXBwZWRDb2x1bW5zID0gY29sdW1uc1dpdGhUb2dnbGUoY29sdW1ucywgdGhpcy5leHBhbmRGdW5jcylcbiAgICAgIGNvbnN0IFdyYXBwZWRTdWJDb21wb25lbnQgPSBzdWJDb21wb25lbnRXaXRoVG9nZ2xlKFxuICAgICAgICBTdWJDb21wb25lbnQsXG4gICAgICAgIHRoaXMuZXhwYW5kRnVuY3NcbiAgICAgIClcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRhYmxlQ29tcG9uZW50XG4gICAgICAgICAgey4uLnJlc3R9XG4gICAgICAgICAgY29sdW1ucz17d3JhcHBlZENvbHVtbnN9XG4gICAgICAgICAgZXhwYW5kZWQ9e3RoaXMuc3RhdGUuZXhwYW5kZWR9XG4gICAgICAgICAgZ2V0VGRQcm9wcz17dGhpcy5nZXRUZFByb3BzfVxuICAgICAgICAgIFN1YkNvbXBvbmVudD17V3JhcHBlZFN1YkNvbXBvbmVudH1cbiAgICAgICAgICBUZENvbXBvbmVudD17QWR2YW5jZWRFeHBhbmRUYWJsZS5UZENvbXBvbmVudH1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gIH1cbiJdfQ==