import React from "react";
import ReactDOM from "react-dom";
import AriaModal from "../src/react-aria-modal";

test("AriaModal raises error when created without titleText or titleId", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const error = jest.fn();
  const oldError = console.error;
  console.error = error;
  try {
    expect(() => ReactDOM.render(<AriaModal />, container)).toThrow(
      /instances should have a `titleText`/
    );
    expect(error).toHaveBeenCalled();
  } finally {
    console.error = oldError;
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  }
});
