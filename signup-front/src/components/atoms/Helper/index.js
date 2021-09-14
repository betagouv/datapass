import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import HelpIcon from '../icons/help';

const Helper = ({ title }) => (
  <span tooltip={title} className="helper">
    <HelpIcon color={'var(--grey)'} />
  </span>
);

Helper.propTypes = {
  title: PropTypes.string,
};

Helper.defaultProps = {
  title: '',
};

export default Helper;
