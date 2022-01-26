var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import classnames from 'classnames';

var defaultButton = function defaultButton(props) {
  return React.createElement(
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


      return React.createElement(
        'div',
        { className: classnames(className, '-pagination'), style: this.props.style },
        React.createElement(
          'div',
          { className: '-previous' },
          React.createElement(
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
        React.createElement(
          'div',
          { className: '-center' },
          React.createElement(
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
        React.createElement(
          'div',
          { className: '-next' },
          React.createElement(
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
}(Component);

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
    return React.createElement(
      'div',
      { className: '-pageJump' },
      React.createElement('input', {
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
    return React.createElement(
      'span',
      { className: '-currentPage' },
      page + 1
    );
  },
  renderTotalPagesCount: function renderTotalPagesCount(pages) {
    return React.createElement(
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
    return React.createElement(
      'span',
      { className: 'select-wrap -pageSizeOptions' },
      React.createElement(
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
            React.createElement(
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
export default ReactTablePagination;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWdpbmF0aW9uLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiY2xhc3NuYW1lcyIsImRlZmF1bHRCdXR0b24iLCJwcm9wcyIsImNoaWxkcmVuIiwiUmVhY3RUYWJsZVBhZ2luYXRpb24iLCJnZXRTYWZlUGFnZSIsImJpbmQiLCJjaGFuZ2VQYWdlIiwiYXBwbHlQYWdlIiwic3RhdGUiLCJwYWdlIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJOdW1iZXIiLCJpc05hTiIsIk1hdGgiLCJtaW4iLCJtYXgiLCJwYWdlcyIsIm9uUGFnZUNoYW5nZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm9uS2V5UHJlc3MiLCJ3aGljaCIsImtleUNvZGUiLCJvbkJsdXIiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidmFsIiwidGFyZ2V0IiwiaW5wdXRUeXBlIiwicGFnZUp1bXBUZXh0Iiwic2hvd1BhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplT3B0aW9ucyIsInBhZ2VTaXplIiwic2hvd1BhZ2VKdW1wIiwiY2FuUHJldmlvdXMiLCJjYW5OZXh0Iiwib25QYWdlU2l6ZUNoYW5nZSIsImNsYXNzTmFtZSIsIlByZXZpb3VzQ29tcG9uZW50IiwiTmV4dENvbXBvbmVudCIsInJlbmRlclBhZ2VKdW1wIiwicmVuZGVyQ3VycmVudFBhZ2UiLCJyZW5kZXJUb3RhbFBhZ2VzQ291bnQiLCJyZW5kZXJQYWdlU2l6ZU9wdGlvbnMiLCJzdHlsZSIsInByZXZpb3VzVGV4dCIsInBhZ2VUZXh0IiwiZ2V0UGFnZUp1bXBQcm9wZXJ0aWVzIiwib2ZUZXh0Iiwicm93c1NlbGVjdG9yVGV4dCIsInJvd3NUZXh0IiwibmV4dFRleHQiLCJkZWZhdWx0UHJvcHMiLCJtYXAiLCJvcHRpb24iLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsT0FBT0EsS0FBUCxJQUFnQkMsU0FBaEIsUUFBaUMsT0FBakM7QUFDQSxPQUFPQyxVQUFQLE1BQXVCLFlBQXZCOztBQUVBLElBQU1D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RSxvQkFBWUg7QUFOZDtBQURGLEtBSGM7QUFBQSxHQUhJO0FBaUJwQnFCLHFCQUFtQjtBQUFBLFdBQVE7QUFBQTtBQUFBLFFBQU0sV0FBVSxjQUFoQjtBQUFnQ2pDLGFBQU87QUFBdkMsS0FBUjtBQUFBLEdBakJDO0FBa0JwQmtDLHlCQUF1QjtBQUFBLFdBQVM7QUFBQTtBQUFBLFFBQU0sV0FBVSxhQUFoQjtBQUErQjFCLGVBQVM7QUFBeEMsS0FBVDtBQUFBLEdBbEJIO0FBbUJwQjJCLHlCQUF1QjtBQUFBLFFBQ3JCWCxRQURxQixTQUNyQkEsUUFEcUI7QUFBQSxRQUVyQkQsZUFGcUIsU0FFckJBLGVBRnFCO0FBQUEsUUFHckJrQixnQkFIcUIsU0FHckJBLGdCQUhxQjtBQUFBLFFBSXJCYixnQkFKcUIsU0FJckJBLGdCQUpxQjtBQUFBLFFBS3JCYyxRQUxxQixTQUtyQkEsUUFMcUI7QUFBQSxXQU9yQjtBQUFBO0FBQUEsUUFBTSxXQUFVLDhCQUFoQjtBQUNFO0FBQUE7QUFBQTtBQUNFLHdCQUFZRCxnQkFEZDtBQUVFLG9CQUFVO0FBQUEsbUJBQUtiLGlCQUFpQnpCLE9BQU9PLEVBQUVTLE1BQUYsQ0FBU0gsS0FBaEIsQ0FBakIsQ0FBTDtBQUFBLFdBRlo7QUFHRSxpQkFBT1E7QUFIVDtBQUtHRCx3QkFBZ0JzQixHQUFoQixDQUFvQixVQUFDQyxNQUFELEVBQVNDLENBQVQ7QUFBQTtBQUNuQjtBQUNBO0FBQUE7QUFBQSxnQkFBUSxLQUFLQSxDQUFiLEVBQWdCLE9BQU9ELE1BQXZCO0FBQ01BLG9CQUROLFNBQ2dCSjtBQURoQjtBQUZtQjtBQUFBLFNBQXBCO0FBTEg7QUFERixLQVBxQjtBQUFBO0FBbkJILEM7ZUFESGhELG9CIiwiZmlsZSI6InBhZ2luYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgY2xhc3NuYW1lcyBmcm9tICdjbGFzc25hbWVzJ1xuXG5jb25zdCBkZWZhdWx0QnV0dG9uID0gcHJvcHMgPT4gKFxuICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiB7Li4ucHJvcHN9IGNsYXNzTmFtZT1cIi1idG5cIj5cbiAgICB7cHJvcHMuY2hpbGRyZW59XG4gIDwvYnV0dG9uPlxuKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdFRhYmxlUGFnaW5hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgUHJldmlvdXNDb21wb25lbnQ6IGRlZmF1bHRCdXR0b24sXG4gICAgTmV4dENvbXBvbmVudDogZGVmYXVsdEJ1dHRvbixcbiAgICByZW5kZXJQYWdlSnVtcDogKHtcbiAgICAgIG9uQ2hhbmdlLCB2YWx1ZSwgb25CbHVyLCBvbktleVByZXNzLCBpbnB1dFR5cGUsIHBhZ2VKdW1wVGV4dCxcbiAgICB9KSA9PiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1wYWdlSnVtcFwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBhcmlhLWxhYmVsPXtwYWdlSnVtcFRleHR9XG4gICAgICAgICAgdHlwZT17aW5wdXRUeXBlfVxuICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgICAgb25LZXlQcmVzcz17b25LZXlQcmVzc31cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICksXG4gICAgcmVuZGVyQ3VycmVudFBhZ2U6IHBhZ2UgPT4gPHNwYW4gY2xhc3NOYW1lPVwiLWN1cnJlbnRQYWdlXCI+e3BhZ2UgKyAxfTwvc3Bhbj4sXG4gICAgcmVuZGVyVG90YWxQYWdlc0NvdW50OiBwYWdlcyA9PiA8c3BhbiBjbGFzc05hbWU9XCItdG90YWxQYWdlc1wiPntwYWdlcyB8fCAxfTwvc3Bhbj4sXG4gICAgcmVuZGVyUGFnZVNpemVPcHRpb25zOiAoe1xuICAgICAgcGFnZVNpemUsXG4gICAgICBwYWdlU2l6ZU9wdGlvbnMsXG4gICAgICByb3dzU2VsZWN0b3JUZXh0LFxuICAgICAgb25QYWdlU2l6ZUNoYW5nZSxcbiAgICAgIHJvd3NUZXh0LFxuICAgIH0pID0+IChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNlbGVjdC13cmFwIC1wYWdlU2l6ZU9wdGlvbnNcIj5cbiAgICAgICAgPHNlbGVjdFxuICAgICAgICAgIGFyaWEtbGFiZWw9e3Jvd3NTZWxlY3RvclRleHR9XG4gICAgICAgICAgb25DaGFuZ2U9e2UgPT4gb25QYWdlU2l6ZUNoYW5nZShOdW1iZXIoZS50YXJnZXQudmFsdWUpKX1cbiAgICAgICAgICB2YWx1ZT17cGFnZVNpemV9XG4gICAgICAgID5cbiAgICAgICAgICB7cGFnZVNpemVPcHRpb25zLm1hcCgob3B0aW9uLCBpKSA9PiAoXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3Qvbm8tYXJyYXktaW5kZXgta2V5XG4gICAgICAgICAgICA8b3B0aW9uIGtleT17aX0gdmFsdWU9e29wdGlvbn0+XG4gICAgICAgICAgICAgIHtgJHtvcHRpb259ICR7cm93c1RleHR9YH1cbiAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvc3Bhbj5cbiAgICApLFxuICB9XG5cbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLmdldFNhZmVQYWdlID0gdGhpcy5nZXRTYWZlUGFnZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5jaGFuZ2VQYWdlID0gdGhpcy5jaGFuZ2VQYWdlLmJpbmQodGhpcylcbiAgICB0aGlzLmFwcGx5UGFnZSA9IHRoaXMuYXBwbHlQYWdlLmJpbmQodGhpcylcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBwYWdlOiBwcm9wcy5wYWdlLFxuICAgIH1cbiAgfVxuXG4gIFVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5wYWdlICE9PSBuZXh0UHJvcHMucGFnZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IG5leHRQcm9wcy5wYWdlIH0pXG4gICAgfVxuICB9XG5cbiAgZ2V0U2FmZVBhZ2UgKHBhZ2UpIHtcbiAgICBpZiAoTnVtYmVyLmlzTmFOKHBhZ2UpKSB7XG4gICAgICBwYWdlID0gdGhpcy5wcm9wcy5wYWdlXG4gICAgfVxuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChwYWdlLCAwKSwgdGhpcy5wcm9wcy5wYWdlcyAtIDEpXG4gIH1cblxuICBjaGFuZ2VQYWdlIChwYWdlKSB7XG4gICAgcGFnZSA9IHRoaXMuZ2V0U2FmZVBhZ2UocGFnZSlcbiAgICB0aGlzLnNldFN0YXRlKHsgcGFnZSB9KVxuICAgIGlmICh0aGlzLnByb3BzLnBhZ2UgIT09IHBhZ2UpIHtcbiAgICAgIHRoaXMucHJvcHMub25QYWdlQ2hhbmdlKHBhZ2UpXG4gICAgfVxuICB9XG5cbiAgYXBwbHlQYWdlIChlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIH1cbiAgICBjb25zdCBwYWdlID0gdGhpcy5zdGF0ZS5wYWdlXG4gICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgPT09ICcnID8gdGhpcy5wcm9wcy5wYWdlIDogcGFnZSlcbiAgfVxuXG4gIGdldFBhZ2VKdW1wUHJvcGVydGllcyAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9uS2V5UHJlc3M6IGUgPT4ge1xuICAgICAgICBpZiAoZS53aGljaCA9PT0gMTMgfHwgZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgIHRoaXMuYXBwbHlQYWdlKClcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9uQmx1cjogdGhpcy5hcHBseVBhZ2UsXG4gICAgICB2YWx1ZTogdGhpcy5zdGF0ZS5wYWdlID09PSAnJyA/ICcnIDogdGhpcy5zdGF0ZS5wYWdlICsgMSxcbiAgICAgIG9uQ2hhbmdlOiBlID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWVcbiAgICAgICAgY29uc3QgcGFnZSA9IHZhbCAtIDFcbiAgICAgICAgaWYgKHZhbCA9PT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHBhZ2U6IHZhbCB9KVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwYWdlOiB0aGlzLmdldFNhZmVQYWdlKHBhZ2UpIH0pXG4gICAgICB9LFxuICAgICAgaW5wdXRUeXBlOiB0aGlzLnN0YXRlLnBhZ2UgPT09ICcnID8gJ3RleHQnIDogJ251bWJlcicsXG4gICAgICBwYWdlSnVtcFRleHQ6IHRoaXMucHJvcHMucGFnZUp1bXBUZXh0LFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3Qge1xuICAgICAgLy8gQ29tcHV0ZWRcbiAgICAgIHBhZ2VzLFxuICAgICAgLy8gUHJvcHNcbiAgICAgIHBhZ2UsXG4gICAgICBzaG93UGFnZVNpemVPcHRpb25zLFxuICAgICAgcGFnZVNpemVPcHRpb25zLFxuICAgICAgcGFnZVNpemUsXG4gICAgICBzaG93UGFnZUp1bXAsXG4gICAgICBjYW5QcmV2aW91cyxcbiAgICAgIGNhbk5leHQsXG4gICAgICBvblBhZ2VTaXplQ2hhbmdlLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgUHJldmlvdXNDb21wb25lbnQsXG4gICAgICBOZXh0Q29tcG9uZW50LFxuICAgICAgcmVuZGVyUGFnZUp1bXAsXG4gICAgICByZW5kZXJDdXJyZW50UGFnZSxcbiAgICAgIHJlbmRlclRvdGFsUGFnZXNDb3VudCxcbiAgICAgIHJlbmRlclBhZ2VTaXplT3B0aW9ucyxcbiAgICB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWVzKGNsYXNzTmFtZSwgJy1wYWdpbmF0aW9uJyl9IHN0eWxlPXt0aGlzLnByb3BzLnN0eWxlfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItcHJldmlvdXNcIj5cbiAgICAgICAgICA8UHJldmlvdXNDb21wb25lbnRcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFjYW5QcmV2aW91cykgcmV0dXJuXG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlUGFnZShwYWdlIC0gMSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBkaXNhYmxlZD17IWNhblByZXZpb3VzfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLnByZXZpb3VzVGV4dH1cbiAgICAgICAgICA8L1ByZXZpb3VzQ29tcG9uZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCItY2VudGVyXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiLXBhZ2VJbmZvXCI+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5wYWdlVGV4dH17JyAnfVxuICAgICAgICAgICAge3Nob3dQYWdlSnVtcCA/IHJlbmRlclBhZ2VKdW1wKHRoaXMuZ2V0UGFnZUp1bXBQcm9wZXJ0aWVzKCkpIDogcmVuZGVyQ3VycmVudFBhZ2UocGFnZSl9eycgJ31cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm9mVGV4dH0ge3JlbmRlclRvdGFsUGFnZXNDb3VudChwYWdlcyl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIHtzaG93UGFnZVNpemVPcHRpb25zICYmXG4gICAgICAgICAgICByZW5kZXJQYWdlU2l6ZU9wdGlvbnMoe1xuICAgICAgICAgICAgICBwYWdlU2l6ZSxcbiAgICAgICAgICAgICAgcm93c1NlbGVjdG9yVGV4dDogdGhpcy5wcm9wcy5yb3dzU2VsZWN0b3JUZXh0LFxuICAgICAgICAgICAgICBwYWdlU2l6ZU9wdGlvbnMsXG4gICAgICAgICAgICAgIG9uUGFnZVNpemVDaGFuZ2UsXG4gICAgICAgICAgICAgIHJvd3NUZXh0OiB0aGlzLnByb3BzLnJvd3NUZXh0LFxuICAgICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIi1uZXh0XCI+XG4gICAgICAgICAgPE5leHRDb21wb25lbnRcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCFjYW5OZXh0KSByZXR1cm5cbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHBhZ2UgKyAxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGRpc2FibGVkPXshY2FuTmV4dH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5uZXh0VGV4dH1cbiAgICAgICAgICA8L05leHRDb21wb25lbnQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=