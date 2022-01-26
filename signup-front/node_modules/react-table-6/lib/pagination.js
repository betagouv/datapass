'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultButton = function defaultButton(props) {
  return _react2.default.createElement(
    'button',
    _extends({ type: 'button' }, props, { className: '-btn' }),
    props.children
  );
};

var ReactTablePagination = function (_Component) {
  _inherits(ReactTablePagination, _Component);

  function ReactTablePagination(props) {
    _classCallCheck(this, ReactTablePagination);

    var _this = _possibleConstructorReturn(this, (ReactTablePagination.__proto__ || Object.getPrototypeOf(ReactTablePagination)).call(this, props));

    _this.getSafePage = _this.getSafePage.bind(_this);
    _this.changePage = _this.changePage.bind(_this);
    _this.applyPage = _this.applyPage.bind(_this);

    _this.state = {
      page: props.page
    };
    return _this;
  }

  _createClass(ReactTablePagination, [{
    key: 'UNSAFE_componentWillReceiveProps',
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.page !== nextProps.page) {
        this.setState({ page: nextProps.page });
      }
    }
  }, {
    key: 'getSafePage',
    value: function getSafePage(page) {
      if (Number.isNaN(page)) {
        page = this.props.page;
      }
      return Math.min(Math.max(page, 0), this.props.pages - 1);
    }
  }, {
    key: 'changePage',
    value: function changePage(page) {
      page = this.getSafePage(page);
      this.setState({ page: page });
      if (this.props.page !== page) {
        this.props.onPageChange(page);
      }
    }
  }, {
    key: 'applyPage',
    value: function applyPage(e) {
      if (e) {
        e.preventDefault();
      }
      var page = this.state.page;
      this.changePage(page === '' ? this.props.page : page);
    }
  }, {
    key: 'getPageJumpProperties',
    value: function getPageJumpProperties() {
      var _this2 = this;

      return {
        onKeyPress: function onKeyPress(e) {
          if (e.which === 13 || e.keyCode === 13) {
            _this2.applyPage();
          }
        },
        onBlur: this.applyPage,
        value: this.state.page === '' ? '' : this.state.page + 1,
        onChange: function onChange(e) {
          var val = e.target.value;
          var page = val - 1;
          if (val === '') {
            return _this2.setState({ page: val });
          }
          _this2.setState({ page: _this2.getSafePage(page) });
        },
        inputType: this.state.page === '' ? 'text' : 'number',
        pageJumpText: this.props.pageJumpText
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          pages = _props.pages,
          page = _props.page,
          showPageSizeOptions = _props.showPageSizeOptions,
          pageSizeOptions = _props.pageSizeOptions,
          pageSize = _props.pageSize,
          showPageJump = _props.showPageJump,
          canPrevious = _props.canPrevious,
          canNext = _props.canNext,
          onPageSizeChange = _props.onPageSizeChange,
          className = _props.className,
          PreviousComponent = _props.PreviousComponent,
          NextComponent = _props.NextComponent,
          renderPageJump = _props.renderPageJump,
          renderCurrentPage = _props.renderCurrentPage,
          renderTotalPagesCount = _props.renderTotalPagesCount,
          renderPageSizeOptions = _props.renderPageSizeOptions;


      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(className, '-pagination'), style: this.props.style },
        _react2.default.createElement(
          'div',
          { className: '-previous' },
          _react2.default.createElement(
            PreviousComponent,
            {
              onClick: function onClick() {
                if (!canPrevious) return;
                _this3.changePage(page - 1);
              },
              disabled: !canPrevious
            },
            this.props.previousText
          )
        ),
        _react2.default.createElement(
          'div',
          { className: '-center' },
          _react2.default.createElement(
            'span',
            { className: '-pageInfo' },
            this.props.pageText,
            ' ',
            showPageJump ? renderPageJump(this.getPageJumpProperties()) : renderCurrentPage(page),
            ' ',
            this.props.ofText,
            ' ',
            renderTotalPagesCount(pages)
          ),
          showPageSizeOptions && renderPageSizeOptions({
            pageSize: pageSize,
            rowsSelectorText: this.props.rowsSelectorText,
            pageSizeOptions: pageSizeOptions,
            onPageSizeChange: onPageSizeChange,
            rowsText: this.props.rowsText
          })
        ),
        _react2.default.createElement(
          'div',
          { className: '-next' },
          _react2.default.createElement(
            NextComponent,
            {
              onClick: function onClick() {
                if (!canNext) return;
                _this3.changePage(page + 1);
              },
              disabled: !canNext
            },
            this.props.nextText
          )
        )
      );
    }
  }]);

  return ReactTablePagination;
}(_react.Component);

ReactTablePagination.defaultProps = {
  PreviousComponent: defaultButton,
  NextComponent: defaultButton,
  renderPageJump: function renderPageJump(_ref) {
    var onChange = _ref.onChange,
        value = _ref.value,
        onBlur = _ref.onBlur,
        onKeyPress = _ref.onKeyPress,
        inputType = _ref.inputType,
        pageJumpText = _ref.pageJumpText;
    return _react2.default.createElement(
      'div',
      { className: '-pageJump' },
      _react2.default.createElement('input', {
        'aria-label': pageJumpText,
        type: inputType,
        onChange: onChange,
        value: value,
        onBlur: onBlur,
        onKeyPress: onKeyPress
      })
    );
  },
  renderCurrentPage: function renderCurrentPage(page) {
    return _react2.default.createElement(
      'span',
      { className: '-currentPage' },
      page + 1
    );
  },
  renderTotalPagesCount: function renderTotalPagesCount(pages) {
    return _react2.default.createElement(
      'span',
      { className: '-totalPages' },
      pages || 1
    );
  },
  renderPageSizeOptions: function renderPageSizeOptions(_ref2) {
    var pageSize = _ref2.pageSize,
        pageSizeOptions = _ref2.pageSizeOptions,
        rowsSelectorText = _ref2.rowsSelectorText,
        onPageSizeChange = _ref2.onPageSizeChange,
        rowsText = _ref2.rowsText;
    return _react2.default.createElement(
      'span',
      { className: 'select-wrap -pageSizeOptions' },
      _react2.default.createElement(
        'select',
        {
          'aria-label': rowsSelectorText,
          onChange: function onChange(e) {
            return onPageSizeChange(Number(e.target.value));
          },
          value: pageSize
        },
        pageSizeOptions.map(function (option, i) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            _react2.default.createElement(
              'option',
              { key: i, value: option },
              option + ' ' + rowsText
            )
          );
        })
      )
    );
  }
};
exports.default = ReactTablePagination;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJOdW1iZXIiLCJpc05hTiIsIk1hdGgiLCJtaW4iLCJtYXgiLCJwYWdlcyIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm9uS2V5UHJlc3MiLCJ3aGljaCIsImtleUNvZGUiLCJvbkJsdXIiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidmFsIiwidGFyZ2V0IiwiaW5wdXRUeXBlIiwicGFnZUp1bXBUZXh0Iiwic2hvd1BhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplIiwic2hvd1BhZ2VKdW1wIiwiY2FuUHJldmlvdXMiLCJjYW5OZXh0Iiwib25QYWdlU2l6ZUNoYW5nZSIsImNsYXNzTmFtZSIsIlByZXZpb3VzQ29tcG9uZW50IiwiTmV4dENvbXBvbmVudCIsInJlbmRlclBhZ2VKdW1wIiwicmVuZGVyQ3VycmVudFBhZ2UiLCJyZW5kZXJUb3RhbFBhZ2VzQ291bnQiLCJyZW5kZXJQYWdlU2l6ZU9wdGlvbnMiLCJzdHlsZSIsInByZXZpb3VzVGV4dCIsInBhZ2VUZXh0IiwiZ2V0UGFnZUp1bXBQcm9wZXJ0aWVzIiwib2ZUZXh0Iiwicm93c1NlbGVjdG9yVGV4dCIsInJvd3NUZXh0IiwibmV4dFRleHQiLCJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiLCJtYXAiLCJvcHRpb24iLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsZ0JBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLFNBQ3BCO0FBQUE7QUFBQSxlQUFRLE1BQUssUUFBYixJQUEwQkMsS0FB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QSxRQUFNLFdBQVUsY0FBaEI7QUFBZ0NqQyxhQUFPO0FBQXZDLEtBQVI7QUFBQSxHQWpCQztBQWtCcEJrQyx5QkFBdUI7QUFBQSxXQUFTO0FBQUE7QUFBQSxRQUFNLFdBQVUsYUFBaEI7QUFBK0IxQixlQUFTO0FBQXhDLEtBQVQ7QUFBQSxHQWxCSDtBQW1CcEIyQix5QkFBdUI7QUFBQSxRQUNyQlgsUUFEcUIsU0FDckJBLFFBRHFCO0FBQUEsUUFFckJELGVBRnFCLFNBRXJCQSxlQUZxQjtBQUFBLFFBR3JCa0IsZ0JBSHFCLFNBR3JCQSxnQkFIcUI7QUFBQSxRQUlyQmIsZ0JBSnFCLFNBSXJCQSxnQkFKcUI7QUFBQSxRQUtyQmMsUUFMcUIsU0FLckJBLFFBTHFCO0FBQUEsV0FPckI7QUFBQTtBQUFBLFFBQU0sV0FBVSw4QkFBaEI7QUFDRTtBQUFBO0FBQUE7QUFDRSx3QkFBWUQsZ0JBRGQ7QUFFRSxvQkFBVTtBQUFBLG1CQUFLYixpQkFBaUJ6QixPQUFPTyxFQUFFUyxNQUFGLENBQVNILEtBQWhCLENBQWpCLENBQUw7QUFBQSxXQUZaO0FBR0UsaUJBQU9RO0FBSFQ7QUFLR0Qsd0JBQWdCdUIsR0FBaEIsQ0FBb0IsVUFBQ0MsTUFBRCxFQUFTQyxDQUFUO0FBQUE7QUFDbkI7QUFDQTtBQUFBO0FBQUEsZ0JBQVEsS0FBS0EsQ0FBYixFQUFnQixPQUFPRCxNQUF2QjtBQUNNQSxvQkFETixTQUNnQkw7QUFEaEI7QUFGbUI7QUFBQSxTQUFwQjtBQUxIO0FBREYsS0FQcUI7QUFBQTtBQW5CSCxDO2tCQURIaEQsb0IiLCJmaWxlIjoicGFnaW5hdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBjbGFzc25hbWVzIGZyb20gJ2NsYXNzbmFtZXMnXG5cbmNvbnN0IGRlZmF1bHRCdXR0b24gPSBwcm9wcyA9PiAoXG4gIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHsuLi5wcm9wc30gY2xhc3NOYW1lPVwiLWJ0blwiPlxuICAgIHtwcm9wcy5jaGlsZHJlbn1cbiAgPC9idXR0b24+XG4pXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlYWN0VGFibGVQYWdpbmF0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBQcmV2aW91c0NvbXBvbmVudDogZGVmYXVsdEJ1dHRvbixcbiAgICBOZXh0Q29tcG9uZW50OiBkZWZhdWx0QnV0dG9uLFxuICAgIHJlbmRlclBhZ2VKdW1wOiAoe1xuICAgICAgb25DaGFuZ2UsIHZhbHVlLCBvbkJsdXIsIG9uS2V5UHJlc3MsIGlucHV0VHlwZSwgcGFnZUp1bXBUZXh0LFxuICAgIH0pID0+IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLXBhZ2VKdW1wXCI+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGFyaWEtbGFiZWw9e3BhZ2VKdW1wVGV4dH1cbiAgICAgICAgICB0eXBlPXtpbnB1dFR5cGV9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgICAgICBvbkJsdXI9e29uQmx1cn1cbiAgICAgICAgICBvbktleVByZXNzPXtvbktleVByZXNzfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKSxcbiAgICByZW5kZXJDdXJyZW50UGFnZTogcGFnZSA9PiA8c3BhbiBjbGFzc05hbWU9XCItY3VycmVudFBhZ2VcIj57cGFnZSArIDF9PC9zcGFuPixcbiAgICByZW5kZXJUb3RhbFBhZ2VzQ291bnQ6IHBhZ2VzID0+IDxzcGFuIGNsYXNzTmFtZT1cIi10b3RhbFBhZ2VzXCI+e3BhZ2VzIHx8IDF9PC9zcGFuPixcbiAgICByZW5kZXJQYWdlU2l6ZU9wdGlvbnM6ICh7XG4gICAgICBwYWdlU2l6ZSxcbiAgICAgIHBhZ2VTaXplT3B0aW9ucyxcbiAgICAgIHJvd3NTZWxlY3RvclRleHQsXG4gICAgICBvblBhZ2VTaXplQ2hhbmdlLFxuICAgICAgcm93c1RleHQsXG4gICAgfSkgPT4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic2VsZWN0LXdyYXAgLXBhZ2VTaXplT3B0aW9uc1wiPlxuICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgYXJpYS1sYWJlbD17cm93c1NlbGVjdG9yVGV4dH1cbiAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBvblBhZ2VTaXplQ2hhbmdlKE51bWJlcihlLnRhcmdldC52YWx1ZSkpfVxuICAgICAgICAgIHZhbHVlPXtwYWdlU2l6ZX1cbiAgICAgICAgPlxuICAgICAgICAgIHtwYWdlU2l6ZU9wdGlvbnMubWFwKChvcHRpb24sIGkpID0+IChcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC9uby1hcnJheS1pbmRleC1rZXlcbiAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpfSB2YWx1ZT17b3B0aW9ufT5cbiAgICAgICAgICAgICAge2Ake29wdGlvbn0gJHtyb3dzVGV4dH1gfVxuICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9zcGFuPlxuICAgICksXG4gIH1cblxuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuZ2V0U2FmZVBhZ2UgPSB0aGlzLmdldFNhZmVQYWdlLmJpbmQodGhpcylcbiAgICB0aGlzLmNoYW5nZVBhZ2UgPSB0aGlzLmNoYW5nZVBhZ2UuYmluZCh0aGlzKVxuICAgIHRoaXMuYXBwbHlQYWdlID0gdGhpcy5hcHBseVBhZ2UuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBhZ2U6IHByb3BzLnBhZ2UsXG4gICAgfVxuICB9XG5cbiAgVU5TQUZFX2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIGlmICh0aGlzLnByb3BzLnBhZ2UgIT09IG5leHRQcm9wcy5wYWdlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgcGFnZTogbmV4dFByb3BzLnBhZ2UgfSlcbiAgICB9XG4gIH1cblxuICBnZXRTYWZlUGFnZSAocGFnZSkge1xuICAgIGlmIChOdW1iZXIuaXNOYU4ocGFnZSkpIHtcbiAgICAgIHBhZ2UgPSB0aGlzLnByb3BzLnBhZ2VcbiAgICB9XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHBhZ2UsIDApLCB0aGlzLnByb3BzLnBhZ2VzIC0gMSlcbiAgfVxuXG4gIGNoYW5nZVBhZ2UgKHBhZ2UpIHtcbiAgICBwYWdlID0gdGhpcy5nZXRTYWZlUGFnZShwYWdlKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlIH0pXG4gICAgaWYgKHRoaXMucHJvcHMucGFnZSAhPT0gcGFnZSkge1xuICAgICAgdGhpcy5wcm9wcy5vblBhZ2VDaGFuZ2UocGFnZSlcbiAgICB9XG4gIH1cblxuICBhcHBseVBhZ2UgKGUpIHtcbiAgICBpZiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfVxuICAgIGNvbnN0IHBhZ2UgPSB0aGlzLnN0YXRlLnBhZ2VcbiAgICB0aGlzLmNoYW5nZVBhZ2UocGFnZSA9PT0gJycgPyB0aGlzLnByb3BzLnBhZ2UgOiBwYWdlKVxuICB9XG5cbiAgZ2V0UGFnZUp1bXBQcm9wZXJ0aWVzICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb25LZXlQcmVzczogZSA9PiB7XG4gICAgICAgIGlmIChlLndoaWNoID09PSAxMyB8fCBlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgdGhpcy5hcHBseVBhZ2UoKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25CbHVyOiB0aGlzLmFwcGx5UGFnZSxcbiAgICAgIHZhbHVlOiB0aGlzLnN0YXRlLnBhZ2UgPT09ICcnID8gJycgOiB0aGlzLnN0YXRlLnBhZ2UgKyAxLFxuICAgICAgb25DaGFuZ2U6IGUgPT4ge1xuICAgICAgICBjb25zdCB2YWwgPSBlLnRhcmdldC52YWx1ZVxuICAgICAgICBjb25zdCBwYWdlID0gdmFsIC0gMVxuICAgICAgICBpZiAodmFsID09PSAnJykge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgcGFnZTogdmFsIH0pXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHRoaXMuZ2V0U2FmZVBhZ2UocGFnZSkgfSlcbiAgICAgIH0sXG4gICAgICBpbnB1dFR5cGU6IHRoaXMuc3RhdGUucGFnZSA9PT0gJycgPyAndGV4dCcgOiAnbnVtYmVyJyxcbiAgICAgIHBhZ2VKdW1wVGV4dDogdGhpcy5wcm9wcy5wYWdlSnVtcFRleHQsXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7XG4gICAgICAvLyBDb21wdXRlZFxuICAgICAgcGFnZXMsXG4gICAgICAvLyBQcm9wc1xuICAgICAgcGFnZSxcbiAgICAgIHNob3dQYWdlU2l6ZU9wdGlvbnMsXG4gICAgICBwYWdlU2l6ZU9wdGlvbnMsXG4gICAgICBwYWdlU2l6ZSxcbiAgICAgIHNob3dQYWdlSnVtcCxcbiAgICAgIGNhblByZXZpb3VzLFxuICAgICAgY2FuTmV4dCxcbiAgICAgIG9uUGFnZVNpemVDaGFuZ2UsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBQcmV2aW91c0NvbXBvbmVudCxcbiAgICAgIE5leHRDb21wb25lbnQsXG4gICAgICByZW5kZXJQYWdlSnVtcCxcbiAgICAgIHJlbmRlckN1cnJlbnRQYWdlLFxuICAgICAgcmVuZGVyVG90YWxQYWdlc0NvdW50LFxuICAgICAgcmVuZGVyUGFnZVNpemVPcHRpb25zLFxuICAgIH0gPSB0aGlzLnByb3BzXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzbmFtZXMoY2xhc3NOYW1lLCAnLXBhZ2luYXRpb24nKX0gc3R5bGU9e3RoaXMucHJvcHMuc3R5bGV9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1wcmV2aW91c1wiPlxuICAgICAgICAgIDxQcmV2aW91c0NvbXBvbmVudFxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWNhblByZXZpb3VzKSByZXR1cm5cbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgLSAxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGRpc2FibGVkPXshY2FuUHJldmlvdXN9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RoaXMucHJvcHMucHJldmlvdXNUZXh0fVxuICAgICAgICAgIDwvUHJldmlvdXNDb21wb25lbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1jZW50ZXJcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCItcGFnZUluZm9cIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnBhZ2VUZXh0fXsnICd9XG4gICAgICAgICAgICB7c2hvd1BhZ2VKdW1wID8gcmVuZGVyUGFnZUp1bXAodGhpcy5nZXRQYWdlSnVtcFByb3BlcnRpZXMoKSkgOiByZW5kZXJDdXJyZW50UGFnZShwYWdlKX17JyAnfVxuICAgICAgICAgICAge3RoaXMucHJvcHMub2ZUZXh0fSB7cmVuZGVyVG90YWxQYWdlc0NvdW50KHBhZ2VzKX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAge3Nob3dQYWdlU2l6ZU9wdGlvbnMgJiZcbiAgICAgICAgICAgIHJlbmRlclBhZ2VTaXplT3B0aW9ucyh7XG4gICAgICAgICAgICAgIHBhZ2VTaXplLFxuICAgICAgICAgICAgICByb3dzU2VsZWN0b3JUZXh0OiB0aGlzLnByb3BzLnJvd3NTZWxlY3RvclRleHQsXG4gICAgICAgICAgICAgIHBhZ2VTaXplT3B0aW9ucyxcbiAgICAgICAgICAgICAgb25QYWdlU2l6ZUNoYW5nZSxcbiAgICAgICAgICAgICAgcm93c1RleHQ6IHRoaXMucHJvcHMucm93c1RleHQsXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiLW5leHRcIj5cbiAgICAgICAgICA8TmV4dENvbXBvbmVudFxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoIWNhbk5leHQpIHJldHVyblxuICAgICAgICAgICAgICB0aGlzLmNoYW5nZVBhZ2UocGFnZSArIDEpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgZGlzYWJsZWQ9eyFjYW5OZXh0fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm5leHRUZXh0fVxuICAgICAgICAgIDwvTmV4dENvbXBvbmVudD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==