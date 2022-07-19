import Highlight from '../../../atoms/Highlight';

export const MessageFeed = ({ title, onClick }) => {
  return (
    <Highlight title={'Message'} onClick={() => console.log('click')}>
      Si vous avez une question vous pouvez à présent laisser un message aux
      instructeurs,
      <br />
      nous vous répondrons dans les meilleurs délais.
    </Highlight>
  );
};

export default MessageFeed;
