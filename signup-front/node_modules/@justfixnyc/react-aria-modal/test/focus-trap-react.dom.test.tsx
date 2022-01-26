import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-dom/test-utils";
import { ReactFocusTrap as FocusTrap } from "../src/focus-trap-react";

describe("dom", () => {
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

    // This surpresses React error boundary logs for testing intentionally
    // thrown errors, like in some test cases in this suite. See discussion of
    // this here: https://github.com/facebook/react/issues/11098
    jest.spyOn(console, "error");
    (global.console.error as any).mockImplementation(() => {});
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(domContainer);
    document.body.removeChild(domContainer);

    (global.console.error as any).mockRestore();
  });

  test("DOM with only required props", () => {
    const trap = TestUtils.renderIntoDocument(
      <FocusTrap _createFocusTrap={mockCreateFocusTrap}>
        <div>
          <button>something special</button>
        </div>
      </FocusTrap>
    );
    const trapNode: any = ReactDOM.findDOMNode(trap as any);

    expect(trapNode.tagName).toBe("DIV");
    expect(trapNode.getAttribute("id")).toBe(null);
    expect(trapNode.getAttribute("class")).toBe(null);
    expect(trapNode.getAttribute("style")).toBe(null);
    expect(trapNode.children.length).toBe(1);
    expect(trapNode.firstChild.tagName).toBe("BUTTON");
    expect(trapNode.firstChild.innerHTML).toBe("something special");
  });

  test("DOM with all possible DOM-related props", () => {
    const trap = TestUtils.renderIntoDocument(
      <FocusTrap _createFocusTrap={mockCreateFocusTrap}>
        <figure id="foo" className="bar">
          <button>something special</button>
        </figure>
      </FocusTrap>
    );
    const trapNode: any = ReactDOM.findDOMNode(trap as any);

    expect(trapNode.tagName).toBe("FIGURE");
    expect(trapNode.getAttribute("id")).toBe("foo");
    expect(trapNode.getAttribute("class")).toBe("bar");
    expect(trapNode.children.length).toBe(1);
    expect(trapNode.firstChild.tagName).toBe("BUTTON");
    expect(trapNode.firstChild.innerHTML).toBe("something special");
  });

  test("FocusTrap throws with no child provided to it", () => {
    expect(() =>
      TestUtils.renderIntoDocument(
        <FocusTrap _createFocusTrap={mockCreateFocusTrap} />
      )
    ).toThrowError("expected to receive a single React element child");
  });

  test("FocusTrap throws with a plain text child provided to it", () => {
    expect(() =>
      TestUtils.renderIntoDocument(
        <FocusTrap _createFocusTrap={mockCreateFocusTrap}>
          Some text that is not a DOM node
        </FocusTrap>
      )
    ).toThrowError("expected to receive a single React element child");
  });

  test("FocusTrap throws with multiple children provided to it", () => {
    expect(() =>
      TestUtils.renderIntoDocument(
        <FocusTrap _createFocusTrap={mockCreateFocusTrap}>
          <div>First div</div>
          <div>Second div</div>
        </FocusTrap>
      )
    ).toThrowError("expected to receive a single React element child");
  });

  test("FocusTrap preserves child ref by composing", () => {
    const childRef = jest.fn();

    TestUtils.renderIntoDocument(
      <FocusTrap _createFocusTrap={mockCreateFocusTrap}>
        <div ref={childRef}></div>
      </FocusTrap>
    );

    expect(childRef).toHaveBeenCalledTimes(1);
  });
});
