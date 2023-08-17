import React, { Component, ReactNode, RefObject } from 'react';
import { delay, throttle } from 'lodash';

import Link from '../atoms/hyperTexts/Link';

const getWindowHash = (): string | null =>
  window.location.hash ? window.location.hash.substr(1) : null;

interface ScrollablePanelProps {
  scrollableId?: string;
  children?: ReactNode;
  className?: string;
}

export class ScrollablePanel extends Component<ScrollablePanelProps, {}> {
  private panelRef: RefObject<HTMLDivElement>;

  constructor(props: ScrollablePanelProps) {
    super(props);
    this.panelRef = React.createRef();
  }

  handleScroll = throttle(() => {
    const offsetTop = this.panelRef.current!.offsetTop;
    const offsetBottom = offsetTop + this.panelRef.current!.offsetHeight;
    const hash = getWindowHash();

    if (
      hash !== this.props.scrollableId &&
      window.scrollY > offsetTop &&
      window.scrollY < offsetBottom
    ) {
      window.history.replaceState({}, '', `#${this.props.scrollableId}`);
    }
    // approx 8 frames
  }, 16 * 8);

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.handleScroll.cancel();
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { scrollableId, children, className } = this.props;
    return (
      <div className={className} id={scrollableId} ref={this.panelRef}>
        {children}
      </div>
    );
  }

  static defaultProps = {
    children: null,
    className: 'panel',
  };
}

interface ScrollableLinkProps {
  scrollableId: string;
  children: ReactNode;
}

interface ScrollableLinkState {
  selected: boolean;
}

export class ScrollableLink extends Component<
  ScrollableLinkProps,
  ScrollableLinkState
> {
  constructor(props: ScrollableLinkProps) {
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
    delay(() => {
      const hash = getWindowHash();
      if (!this.state.selected && this.props.scrollableId === hash) {
        (
          document.querySelector(
            `.fr-sidemenu__item a[href="#${this.props.scrollableId}"]`
          ) as HTMLElement
        )?.click();
      }
    }, 500);

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.handleScroll.cancel();
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { scrollableId, children } = this.props;

    return (
      <li className="fr-sidemenu__item">
        <Link
          sidemenu
          href={`#${scrollableId}`}
          target="_self"
          aria-current={this.state.selected ? 'true' : null}
        >
          {children}
        </Link>
      </li>
    );
  }
}
