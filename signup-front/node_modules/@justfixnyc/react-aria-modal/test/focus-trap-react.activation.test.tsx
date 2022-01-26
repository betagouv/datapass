import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-dom/test-utils";
import { ReactFocusTrap as FocusTrap } from "../src/focus-trap-react";

describe("activation", () => {
  let domContainer: any;
  const createMockFocusTrap = () => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
    pause: jest.fn(),
  });
  let mockFocusTrap = createMockFocusTrap();
  let mockCreateFocusTrap: any;

  beforeEach(() => {
    mockFocusTrap = createMockFocusTrap();
    mockCreateFocusTrap = jest.fn(() => mockFocusTrap);
    domContainer = document.createElement("div");
    document.body.appendChild(domContainer);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(domContainer);
    document.body.removeChild(domContainer);
  });

  test("default activation", () => {
    const trap = ReactDOM.render(
      <FocusTrap
        _createFocusTrap={mockCreateFocusTrap}
        focusTrapOptions={{ onDeactivate: noop }}
      >
        <button>something special</button>
      </FocusTrap>,
      domContainer
    );

    expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1);
    expect(mockCreateFocusTrap).toHaveBeenCalledWith(
      ReactDOM.findDOMNode(trap as any),
      {
        onDeactivate: noop,
        returnFocusOnDeactivate: false,
      }
    );
  });

  test("activation with initialFocus as selector", () => {
    const trap = ReactDOM.render(
      <FocusTrap
        _createFocusTrap={mockCreateFocusTrap}
        focusTrapOptions={{
          onDeactivate: noop,
          initialFocus: "#initial-focusee",
        }}
      >
        <div>
          <button>something special</button>
          <button id="initial-focusee">another thing</button>
        </div>
      </FocusTrap>,
      domContainer
    );

    expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1);
    expect(mockCreateFocusTrap).toHaveBeenCalledWith(
      ReactDOM.findDOMNode(trap as any),
      {
        onDeactivate: noop,
        initialFocus: "#initial-focusee",
        returnFocusOnDeactivate: false,
      }
    );
  });

  test("mounting without activation", () => {
    ReactDOM.render(
      <FocusTrap
        _createFocusTrap={mockCreateFocusTrap}
        focusTrapOptions={{ onDeactivate: noop }}
        active={false}
      >
        <button>something special</button>
      </FocusTrap>,
      domContainer
    );
    expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1);
    expect(mockFocusTrap.activate).toHaveBeenCalledTimes(0);
  });

  test("mounting without activation then activating", () => {
    class TestZone extends React.Component {
      state = {
        trapActive: false,
      };

      activateTrap = () => {
        this.setState({ trapActive: true });
      };

      render() {
        return (
          <div>
            <button ref="trigger" onClick={this.activateTrap}>
              activate
            </button>
            <FocusTrap
              _createFocusTrap={mockCreateFocusTrap}
              ref="trap"
              focusTrapOptions={{ onDeactivate: noop }}
              active={this.state.trapActive}
            >
              <button>something special</button>
            </FocusTrap>
          </div>
        );
      }
    }

    const zone: any = ReactDOM.render(<TestZone />, domContainer);

    expect(mockCreateFocusTrap).toHaveBeenCalledTimes(1);
    expect(mockCreateFocusTrap).toHaveBeenCalledWith(
      ReactDOM.findDOMNode(zone.refs.trap),
      {
        onDeactivate: noop,
        returnFocusOnDeactivate: false,
      }
    );
    expect(mockFocusTrap.activate).toHaveBeenCalledTimes(0);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(zone.refs.trigger) as any);

    expect(mockFocusTrap.activate).toHaveBeenCalledTimes(1);
  });
});

function noop() {}
