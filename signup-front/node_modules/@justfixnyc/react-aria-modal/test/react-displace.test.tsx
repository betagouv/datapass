import React from "react";
import ReactDOM from "react-dom";
import { displace } from "../src/react-displace";

const Thingy: React.FC<{}> = () => <p id="thingy">I am thingy</p>;
const DisplacedThingy = displace(Thingy);

test("Displace renders into displaced element", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  try {
    ReactDOM.render(<DisplacedThingy />, container);
    expect(container.innerHTML).toBe("");
    const thingy = document.getElementById("thingy");
    if (!thingy) throw new Error("displaced element not found!");
    expect(thingy.innerHTML).toBe("I am thingy");
  } finally {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  }
});
