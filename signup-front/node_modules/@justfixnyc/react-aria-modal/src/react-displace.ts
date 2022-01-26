// https://github.com/davidtheclark/react-displace/blob/master/src/displace.js

import React from "react";
import ReactDOM from "react-dom";

type DisplaceOptions = {
  renderTo?: string | Element;
};

export function displace<P>(
  WrappedComponent: React.ComponentType<P>,
  optionalOptions?: DisplaceOptions
): React.ComponentType<P & { mounted?: boolean }> {
  const options = optionalOptions || {};

  class Displaced extends React.Component<P & { mounted?: boolean }> {
    container: Element | undefined;

    componentDidMount() {
      this.container = (() => {
        const { renderTo } = options;
        if (!renderTo) {
          var result = document.createElement("div");
          document.body.appendChild(result);
          return result;
        } else if (typeof renderTo === "string") {
          const el = document.querySelector(renderTo);
          if (!el) {
            throw new Error(`No element matches "${renderTo}"!`);
          }
          return el;
        } else {
          return renderTo;
        }
      })();
      this.forceUpdate();
    }

    componentWillUnmount() {
      if (!options.renderTo && this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }

    render() {
      if (this.props.mounted === false) return null;
      if (this.container) {
        return ReactDOM.createPortal(
          React.createElement(
            WrappedComponent,
            this.props,
            this.props.children
          ),
          this.container
        );
      }
      return false;
    }
  }

  return Displaced;
}
