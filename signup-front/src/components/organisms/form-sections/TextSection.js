import React from 'react';
import PropTypes from 'prop-types';
import { ScrollablePanel } from '../Scrollable';

const TextSection = ({ id = 'head', title, children }) => (
  <ScrollablePanel scrollableId={id}>
    {title && <h2>{title}</h2>}
    {children}
  </ScrollablePanel>
);

TextSection.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default TextSection;
