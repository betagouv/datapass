var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export default (function (Base) {
  return function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'UNSAFE_componentWillMount',
      value: function UNSAFE_componentWillMount() {
        this.setStateWithData(this.getDataModel(this.getResolvedState(), true));
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.fireFetchData();
      }
    }, {
      key: 'UNSAFE_componentWillReceiveProps',
      value: function UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        var oldState = this.getResolvedState();
        var newState = this.getResolvedState(nextProps, nextState);

        // Do a deep compare of new and old `defaultOption` and
        // if they are different reset `option = defaultOption`
        var defaultableOptions = ['sorted', 'filtered', 'resized', 'expanded'];
        defaultableOptions.forEach(function (x) {
          var defaultName = 'default' + (x.charAt(0).toUpperCase() + x.slice(1));
          if (JSON.stringify(oldState[defaultName]) !== JSON.stringify(newState[defaultName])) {
            newState[x] = newState[defaultName];
          }
        });

        // If they change these table options, we need to reset defaults
        // or else we could get into a state where the user has changed the UI
        // and then disabled the ability to change it back.
        // e.g. If `filterable` has changed, set `filtered = defaultFiltered`
        var resettableOptions = ['sortable', 'filterable', 'resizable'];
        resettableOptions.forEach(function (x) {
          if (oldState[x] !== newState[x]) {
            var baseName = x.replace('able', '');
            var optionName = baseName + 'ed';
            var defaultName = 'default' + (optionName.charAt(0).toUpperCase() + optionName.slice(1));
            newState[optionName] = newState[defaultName];
          }
        });

        // Props that trigger a data update
        if (oldState.data !== newState.data || oldState.columns !== newState.columns || oldState.pivotBy !== newState.pivotBy || oldState.sorted !== newState.sorted || oldState.filtered !== newState.filtered) {
          this.setStateWithData(this.getDataModel(newState, oldState.data !== newState.data));
        }
      }
    }, {
      key: 'setStateWithData',
      value: function setStateWithData(newState, cb) {
        var _this2 = this;

        var oldState = this.getResolvedState();
        var newResolvedState = this.getResolvedState({}, newState);
        var freezeWhenExpanded = newResolvedState.freezeWhenExpanded;

        // Default to unfrozen state

        newResolvedState.frozen = false;

        // If freezeWhenExpanded is set, check for frozen conditions
        if (freezeWhenExpanded) {
          // if any rows are expanded, freeze the existing data and sorting
          var keys = Object.keys(newResolvedState.expanded);
          for (var i = 0; i < keys.length; i += 1) {
            if (newResolvedState.expanded[keys[i]]) {
              newResolvedState.frozen = true;
              break;
            }
          }
        }

        // If the data isn't frozen and either the data or
        // sorting model has changed, update the data
        if (oldState.frozen && !newResolvedState.frozen || oldState.sorted !== newResolvedState.sorted || oldState.filtered !== newResolvedState.filtered || oldState.showFilters !== newResolvedState.showFilters || !newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData) {
          // Handle collapseOnsortedChange & collapseOnDataChange
          if (oldState.sorted !== newResolvedState.sorted && this.props.collapseOnSortingChange || oldState.filtered !== newResolvedState.filtered || oldState.showFilters !== newResolvedState.showFilters || oldState.sortedData && !newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData && this.props.collapseOnDataChange) {
            newResolvedState.expanded = {};
          }

          Object.assign(newResolvedState, this.getSortedData(newResolvedState));
        }

        // Set page to 0 if filters change
        if (oldState.filtered !== newResolvedState.filtered) {
          newResolvedState.page = 0;
        }

        // Calculate pageSize all the time
        if (newResolvedState.sortedData) {
          newResolvedState.pages = newResolvedState.manual ? newResolvedState.pages : Math.ceil(newResolvedState.sortedData.length / newResolvedState.pageSize);
          newResolvedState.page = newResolvedState.manual ? newResolvedState.page : Math.max(newResolvedState.page >= newResolvedState.pages ? newResolvedState.pages - 1 : newResolvedState.page, 0);
        }

        return this.setState(newResolvedState, function () {
          if (cb) {
            cb();
          }
          if (oldState.page !== newResolvedState.page || oldState.pageSize !== newResolvedState.pageSize || oldState.sorted !== newResolvedState.sorted || oldState.filtered !== newResolvedState.filtered) {
            _this2.fireFetchData();
          }
        });
      }
    }]);

    return _class;
  }(Base);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saWZlY3ljbGUuanMiXSwibmFtZXMiOlsic2V0U3RhdGVXaXRoRGF0YSIsImdldERhdGFNb2RlbCIsImdldFJlc29sdmVkU3RhdGUiLCJmaXJlRmV0Y2hEYXRhIiwibmV4dFByb3BzIiwibmV4dFN0YXRlIiwib2xkU3RhdGUiLCJuZXdTdGF0ZSIsImRlZmF1bHRhYmxlT3B0aW9ucyIsImZvckVhY2giLCJkZWZhdWx0TmFtZSIsIngiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlc2V0dGFibGVPcHRpb25zIiwiYmFzZU5hbWUiLCJyZXBsYWNlIiwib3B0aW9uTmFtZSIsImRhdGEiLCJjb2x1bW5zIiwicGl2b3RCeSIsInNvcnRlZCIsImZpbHRlcmVkIiwiY2IiLCJuZXdSZXNvbHZlZFN0YXRlIiwiZnJlZXplV2hlbkV4cGFuZGVkIiwiZnJvemVuIiwia2V5cyIsIk9iamVjdCIsImV4cGFuZGVkIiwiaSIsImxlbmd0aCIsInNob3dGaWx0ZXJzIiwicmVzb2x2ZWREYXRhIiwicHJvcHMiLCJjb2xsYXBzZU9uU29ydGluZ0NoYW5nZSIsInNvcnRlZERhdGEiLCJjb2xsYXBzZU9uRGF0YUNoYW5nZSIsImFzc2lnbiIsImdldFNvcnRlZERhdGEiLCJwYWdlIiwicGFnZXMiLCJtYW51YWwiLCJNYXRoIiwiY2VpbCIsInBhZ2VTaXplIiwibWF4Iiwic2V0U3RhdGUiLCJCYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLGdCQUFlO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGtEQUVrQjtBQUMzQixhQUFLQSxnQkFBTCxDQUFzQixLQUFLQyxZQUFMLENBQWtCLEtBQUtDLGdCQUFMLEVBQWxCLEVBQTJDLElBQTNDLENBQXRCO0FBQ0Q7QUFKVTtBQUFBO0FBQUEsMENBTVU7QUFDbkIsYUFBS0MsYUFBTDtBQUNEO0FBUlU7QUFBQTtBQUFBLHVEQVV1QkMsU0FW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S0FBS0csR0FBTCxDQUN4RXRCLGlCQUFpQmdCLElBQWpCLElBQXlCaEIsaUJBQWlCaUIsS0FBMUMsR0FDSWpCLGlCQUFpQmlCLEtBQWpCLEdBQXlCLENBRDdCLEdBRUlqQixpQkFBaUJnQixJQUhtRCxFQUl4RSxDQUp3RSxDQUExRTtBQU1EOztBQUVELGVBQU8sS0FBS08sUUFBTCxDQUFjdkIsZ0JBQWQsRUFBZ0MsWUFBTTtBQUMzQyxjQUFJRCxFQUFKLEVBQVE7QUFDTkE7QUFDRDtBQUNELGNBQ0VwQixTQUFTcUMsSUFBVCxLQUFrQmhCLGlCQUFpQmdCLElBQW5DLElBQ0FyQyxTQUFTMEMsUUFBVCxLQUFzQnJCLGlCQUFpQnFCLFFBRHZDLElBRUExQyxTQUFTa0IsTUFBVCxLQUFvQkcsaUJBQWlCSCxNQUZyQyxJQUdBbEIsU0FBU21CLFFBQVQsS0FBc0JFLGlCQUFpQkYsUUFKekMsRUFLRTtBQUNBLG1CQUFLdEIsYUFBTDtBQUNEO0FBQ0YsU0FaTSxDQUFQO0FBYUQ7QUE5SFU7O0FBQUE7QUFBQSxJQUNDZ0QsSUFERDtBQUFBLENBQWYiLCJmaWxlIjoibGlmZWN5Y2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgQmFzZSA9PlxuICBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICAgIFVOU0FGRV9jb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKHRoaXMuZ2V0RGF0YU1vZGVsKHRoaXMuZ2V0UmVzb2x2ZWRTdGF0ZSgpLCB0cnVlKSlcbiAgICB9XG5cbiAgICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgICB0aGlzLmZpcmVGZXRjaERhdGEoKVxuICAgIH1cblxuICAgIFVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMsIG5leHRTdGF0ZSkge1xuICAgICAgY29uc3Qgb2xkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoKVxuICAgICAgY29uc3QgbmV3U3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUobmV4dFByb3BzLCBuZXh0U3RhdGUpXG5cbiAgICAgIC8vIERvIGEgZGVlcCBjb21wYXJlIG9mIG5ldyBhbmQgb2xkIGBkZWZhdWx0T3B0aW9uYCBhbmRcbiAgICAgIC8vIGlmIHRoZXkgYXJlIGRpZmZlcmVudCByZXNldCBgb3B0aW9uID0gZGVmYXVsdE9wdGlvbmBcbiAgICAgIGNvbnN0IGRlZmF1bHRhYmxlT3B0aW9ucyA9IFsnc29ydGVkJywgJ2ZpbHRlcmVkJywgJ3Jlc2l6ZWQnLCAnZXhwYW5kZWQnXVxuICAgICAgZGVmYXVsdGFibGVPcHRpb25zLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHROYW1lID0gYGRlZmF1bHQke3guY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB4LnNsaWNlKDEpfWBcbiAgICAgICAgaWYgKEpTT04uc3RyaW5naWZ5KG9sZFN0YXRlW2RlZmF1bHROYW1lXSkgIT09IEpTT04uc3RyaW5naWZ5KG5ld1N0YXRlW2RlZmF1bHROYW1lXSkpIHtcbiAgICAgICAgICBuZXdTdGF0ZVt4XSA9IG5ld1N0YXRlW2RlZmF1bHROYW1lXVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyBJZiB0aGV5IGNoYW5nZSB0aGVzZSB0YWJsZSBvcHRpb25zLCB3ZSBuZWVkIHRvIHJlc2V0IGRlZmF1bHRzXG4gICAgICAvLyBvciBlbHNlIHdlIGNvdWxkIGdldCBpbnRvIGEgc3RhdGUgd2hlcmUgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIFVJXG4gICAgICAvLyBhbmQgdGhlbiBkaXNhYmxlZCB0aGUgYWJpbGl0eSB0byBjaGFuZ2UgaXQgYmFjay5cbiAgICAgIC8vIGUuZy4gSWYgYGZpbHRlcmFibGVgIGhhcyBjaGFuZ2VkLCBzZXQgYGZpbHRlcmVkID0gZGVmYXVsdEZpbHRlcmVkYFxuICAgICAgY29uc3QgcmVzZXR0YWJsZU9wdGlvbnMgPSBbJ3NvcnRhYmxlJywgJ2ZpbHRlcmFibGUnLCAncmVzaXphYmxlJ11cbiAgICAgIHJlc2V0dGFibGVPcHRpb25zLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGlmIChvbGRTdGF0ZVt4XSAhPT0gbmV3U3RhdGVbeF0pIHtcbiAgICAgICAgICBjb25zdCBiYXNlTmFtZSA9IHgucmVwbGFjZSgnYWJsZScsICcnKVxuICAgICAgICAgIGNvbnN0IG9wdGlvbk5hbWUgPSBgJHtiYXNlTmFtZX1lZGBcbiAgICAgICAgICBjb25zdCBkZWZhdWx0TmFtZSA9IGBkZWZhdWx0JHtvcHRpb25OYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgb3B0aW9uTmFtZS5zbGljZSgxKX1gXG4gICAgICAgICAgbmV3U3RhdGVbb3B0aW9uTmFtZV0gPSBuZXdTdGF0ZVtkZWZhdWx0TmFtZV1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8gUHJvcHMgdGhhdCB0cmlnZ2VyIGEgZGF0YSB1cGRhdGVcbiAgICAgIGlmIChcbiAgICAgICAgb2xkU3RhdGUuZGF0YSAhPT0gbmV3U3RhdGUuZGF0YSB8fFxuICAgICAgICBvbGRTdGF0ZS5jb2x1bW5zICE9PSBuZXdTdGF0ZS5jb2x1bW5zIHx8XG4gICAgICAgIG9sZFN0YXRlLnBpdm90QnkgIT09IG5ld1N0YXRlLnBpdm90QnkgfHxcbiAgICAgICAgb2xkU3RhdGUuc29ydGVkICE9PSBuZXdTdGF0ZS5zb3J0ZWQgfHxcbiAgICAgICAgb2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1N0YXRlLmZpbHRlcmVkXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZVdpdGhEYXRhKHRoaXMuZ2V0RGF0YU1vZGVsKG5ld1N0YXRlLCBvbGRTdGF0ZS5kYXRhICE9PSBuZXdTdGF0ZS5kYXRhKSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTdGF0ZVdpdGhEYXRhIChuZXdTdGF0ZSwgY2IpIHtcbiAgICAgIGNvbnN0IG9sZFN0YXRlID0gdGhpcy5nZXRSZXNvbHZlZFN0YXRlKClcbiAgICAgIGNvbnN0IG5ld1Jlc29sdmVkU3RhdGUgPSB0aGlzLmdldFJlc29sdmVkU3RhdGUoe30sIG5ld1N0YXRlKVxuICAgICAgY29uc3QgeyBmcmVlemVXaGVuRXhwYW5kZWQgfSA9IG5ld1Jlc29sdmVkU3RhdGVcblxuICAgICAgLy8gRGVmYXVsdCB0byB1bmZyb3plbiBzdGF0ZVxuICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5mcm96ZW4gPSBmYWxzZVxuXG4gICAgICAvLyBJZiBmcmVlemVXaGVuRXhwYW5kZWQgaXMgc2V0LCBjaGVjayBmb3IgZnJvemVuIGNvbmRpdGlvbnNcbiAgICAgIGlmIChmcmVlemVXaGVuRXhwYW5kZWQpIHtcbiAgICAgICAgLy8gaWYgYW55IHJvd3MgYXJlIGV4cGFuZGVkLCBmcmVlemUgdGhlIGV4aXN0aW5nIGRhdGEgYW5kIHNvcnRpbmdcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5ld1Jlc29sdmVkU3RhdGUuZXhwYW5kZWQpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIGlmIChuZXdSZXNvbHZlZFN0YXRlLmV4cGFuZGVkW2tleXNbaV1dKSB7XG4gICAgICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLmZyb3plbiA9IHRydWVcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZSBkYXRhIGlzbid0IGZyb3plbiBhbmQgZWl0aGVyIHRoZSBkYXRhIG9yXG4gICAgICAvLyBzb3J0aW5nIG1vZGVsIGhhcyBjaGFuZ2VkLCB1cGRhdGUgdGhlIGRhdGFcbiAgICAgIGlmIChcbiAgICAgICAgKG9sZFN0YXRlLmZyb3plbiAmJiAhbmV3UmVzb2x2ZWRTdGF0ZS5mcm96ZW4pIHx8XG4gICAgICAgIG9sZFN0YXRlLnNvcnRlZCAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5zb3J0ZWQgfHxcbiAgICAgICAgb2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuZmlsdGVyZWQgfHxcbiAgICAgICAgb2xkU3RhdGUuc2hvd0ZpbHRlcnMgIT09IG5ld1Jlc29sdmVkU3RhdGUuc2hvd0ZpbHRlcnMgfHxcbiAgICAgICAgKCFuZXdSZXNvbHZlZFN0YXRlLmZyb3plbiAmJiBvbGRTdGF0ZS5yZXNvbHZlZERhdGEgIT09IG5ld1Jlc29sdmVkU3RhdGUucmVzb2x2ZWREYXRhKVxuICAgICAgKSB7XG4gICAgICAgIC8vIEhhbmRsZSBjb2xsYXBzZU9uc29ydGVkQ2hhbmdlICYgY29sbGFwc2VPbkRhdGFDaGFuZ2VcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkICYmIHRoaXMucHJvcHMuY29sbGFwc2VPblNvcnRpbmdDaGFuZ2UpIHx8XG4gICAgICAgICAgb2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuZmlsdGVyZWQgfHxcbiAgICAgICAgICBvbGRTdGF0ZS5zaG93RmlsdGVycyAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5zaG93RmlsdGVycyB8fFxuICAgICAgICAgIChvbGRTdGF0ZS5zb3J0ZWREYXRhICYmXG4gICAgICAgICAgICAhbmV3UmVzb2x2ZWRTdGF0ZS5mcm96ZW4gJiZcbiAgICAgICAgICAgIG9sZFN0YXRlLnJlc29sdmVkRGF0YSAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5yZXNvbHZlZERhdGEgJiZcbiAgICAgICAgICAgIHRoaXMucHJvcHMuY29sbGFwc2VPbkRhdGFDaGFuZ2UpXG4gICAgICAgICkge1xuICAgICAgICAgIG5ld1Jlc29sdmVkU3RhdGUuZXhwYW5kZWQgPSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbihuZXdSZXNvbHZlZFN0YXRlLCB0aGlzLmdldFNvcnRlZERhdGEobmV3UmVzb2x2ZWRTdGF0ZSkpXG4gICAgICB9XG5cbiAgICAgIC8vIFNldCBwYWdlIHRvIDAgaWYgZmlsdGVycyBjaGFuZ2VcbiAgICAgIGlmIChvbGRTdGF0ZS5maWx0ZXJlZCAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5maWx0ZXJlZCkge1xuICAgICAgICBuZXdSZXNvbHZlZFN0YXRlLnBhZ2UgPSAwXG4gICAgICB9XG5cbiAgICAgIC8vIENhbGN1bGF0ZSBwYWdlU2l6ZSBhbGwgdGhlIHRpbWVcbiAgICAgIGlmIChuZXdSZXNvbHZlZFN0YXRlLnNvcnRlZERhdGEpIHtcbiAgICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlcyA9IG5ld1Jlc29sdmVkU3RhdGUubWFudWFsXG4gICAgICAgICAgPyBuZXdSZXNvbHZlZFN0YXRlLnBhZ2VzXG4gICAgICAgICAgOiBNYXRoLmNlaWwobmV3UmVzb2x2ZWRTdGF0ZS5zb3J0ZWREYXRhLmxlbmd0aCAvIG5ld1Jlc29sdmVkU3RhdGUucGFnZVNpemUpXG4gICAgICAgIG5ld1Jlc29sdmVkU3RhdGUucGFnZSA9IG5ld1Jlc29sdmVkU3RhdGUubWFudWFsID8gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlIDogTWF0aC5tYXgoXG4gICAgICAgICAgbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlID49IG5ld1Jlc29sdmVkU3RhdGUucGFnZXNcbiAgICAgICAgICAgID8gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlcyAtIDFcbiAgICAgICAgICAgIDogbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlLFxuICAgICAgICAgIDBcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZShuZXdSZXNvbHZlZFN0YXRlLCAoKSA9PiB7XG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKClcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgb2xkU3RhdGUucGFnZSAhPT0gbmV3UmVzb2x2ZWRTdGF0ZS5wYWdlIHx8XG4gICAgICAgICAgb2xkU3RhdGUucGFnZVNpemUgIT09IG5ld1Jlc29sdmVkU3RhdGUucGFnZVNpemUgfHxcbiAgICAgICAgICBvbGRTdGF0ZS5zb3J0ZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuc29ydGVkIHx8XG4gICAgICAgICAgb2xkU3RhdGUuZmlsdGVyZWQgIT09IG5ld1Jlc29sdmVkU3RhdGUuZmlsdGVyZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5maXJlRmV0Y2hEYXRhKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiJdfQ==