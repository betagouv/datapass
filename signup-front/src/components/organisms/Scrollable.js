import React, { Component } from 'react';
import { delay, throttle } from 'lodash';
import PropTypes from 'prop-types';
import Link from '../atoms/hyperTexts/Link';

const getWindowHash = () =>
  window.location.hash ? window.location.hash.substr(1) : null;

export class ScrollablePanel extends Component {
  constructor(props) {
    super(props);
    this.panelRef = React.createRef();
  }

  handleScroll = throttle(() => {
    const offsetTop = this.panelRef.current.offsetTop;
    const offsetBottom = offsetTop + this.panelRef.current.offsetHeight;
    const hash = getWindowHash();

    if (
      hash !== this.props.scrollableId &&
      window.scrollY > offsetTop &&
      window.scrollY < offsetBottom
    ) {
      window.history.replaceState(
        undefined,
        undefined,
        `#${this.props.scrollableId}`
      );
    }
    // approx 8 frames
  }, 16 * 8);

  componentDidMount() {
    return window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.handleScroll.cancel();
    return window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { scrollableId, children, className } = this.props;
    return (
      <div className={className} id={scrollableId} ref={this.panelRef}>
        {children}
      </div>
    );
  }
}

ScrollablePanel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  scrollableId: PropTypes.string.isRequired,
};

ScrollablePanel.defaultProps = {
  children: null,
  className: 'panel',
};

export class ScrollableLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  handleScroll = throttle(() => {
    const hash = getWindowHash();
    if (!this.state.selected && this.props.scrollableId === hash) {
      this.setState({ selected: true });
    }
    if (this.state.selected && this.props.scrollableId !== hash) {
      this.setState({ selected: false });
    }
    // approx 8 frames
  }, 16 * 8);

  componentDidMount() {
    // Hackish way to trigger initial scroll.
    // As it's difficult to determine when all ScrollablePanels are fully rendered,
    // we suppose that after 500ms this is the case to avoid complex implementation.
    // Then we simply trigger the link by clicking on it.
    delay(() => {
      const hash = getWindowHash();
      if (!this.state.selected && this.props.scrollableId === hash) {
        document
          .querySelector(
            `.fr-sidemenu__item a[href="#${this.props.scrollableId}"]`
          )
          ?.click();
      }
    }, 500);

    return window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.handleScroll.cancel();
    return window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { scrollableId, children, style } = this.props;

    return (
      <li className="fr-sidemenu__item">
        <Link
          sidemenu
          href={`#${scrollableId}`}
          style={style}
          target="_self"
          aria-current={this.state.selected ? true : null}
        >
          {children}
        </Link>
      </li>
    );
  }
}

ScrollableLink.propTypes = {
  scrollableId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};
