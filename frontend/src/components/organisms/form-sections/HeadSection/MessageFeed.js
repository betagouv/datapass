import PropTypes from 'prop-types';
import React from 'react';
import Button from '../../../atoms/hyperTexts/Button';
import './MessageFeed.css';

class MessageFeed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { writeMessage: 'redirect to the message window' };
  }

  render() {
    const { writeMessage } = this.state;

    return (
      <div className="message-feed-container">
        <div className="fr-highlight message-head">
          <h5>Message</h5>
          <p>
            Si vous avez une question vous pouvez à présent laisser un message
            aux instructeurs,
          </p>
          <p>nous vous répondrons dans les meilleurs délais.</p>
        </div>
        <div className="message-btn-container">
          <div className="message-btn">
            <Button
              outline
              icon="edit"
              onClick={() => this.setState({ writeMessage: !writeMessage })}
            >
              Rédiger un message
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

MessageFeed.propTypes = {
  events: PropTypes.array,
};

MessageFeed.defaultProps = {
  events: [],
};

export default MessageFeed;
