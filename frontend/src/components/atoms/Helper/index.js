import PropTypes from 'prop-types';
import { HelpIcon } from '../icons/fr-fi-icons';
import './style.css';

const Helper = ({ title = '' }) => {
  let helperClass = 'helper';

  if (title.length > 140) {
    helperClass += ' helper-large';
  }
  return (
    <span tooltip={title} className={helperClass}>
      <HelpIcon color={'var(--text-default-grey)'} />
    </span>
  );
};

Helper.propTypes = {
  title: PropTypes.string,
};

Helper.defaultProps = {
  title: '',
};

export default Helper;
