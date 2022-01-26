import React from "react";
import ReactDOM from "react-dom";
import AriaModal from "../src/react-aria-modal";

class DemoTen extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      modalActive: false,
    };

    this.activateModal = this.activateModal.bind(this);
    this.deactivateModal = this.deactivateModal.bind(this);
    this.getApplicationNode = this.getApplicationNode.bind(this);
  }

  activateModal() {
    this.setState({ modalActive: true });
  }

  deactivateModal = () => {
    this.setState({ modalActive: false });
  };

  getApplicationNode() {
    return document.getElementById("application") as any;
  }

  render() {
    const modal = this.state.modalActive ? (
      <AriaModal
        titleText="demo ten"
        onExit={this.deactivateModal}
        getApplicationNode={this.getApplicationNode}
        underlayStyle={{ paddingTop: "2em" }}
        focusTrapOptions={{
          initialFocus: "#demo-ten-deactivate",
          returnFocusOnDeactivate: false,
        }}
      >
        <div id="demo-ten-modal" className="modal">
          <div className="modal-body">
            <p>
              Here is a modal <a href="#">with</a> <a href="#">some</a>{" "}
              <a href="#">focusable</a> parts.
            </p>
          </div>
          <footer className="modal-footer">
            <button id="demo-ten-deactivate" onClick={this.deactivateModal}>
              deactivate modal
            </button>
          </footer>
        </div>
      </AriaModal>
    ) : (
      false
    );

    return (
      <div>
        <button onClick={this.activateModal}>activate modal</button>
        {modal}
      </div>
    );
  }
}

ReactDOM.render(<DemoTen />, document.getElementById("demo-ten"));
