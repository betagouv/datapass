import React from 'react';
import Helper from '../Helper';

export const Label = ({ id, label, required, helper, meta }) => (
  <label className="fr-label" htmlFor={id}>
    {label}
    {required && ' *'}
    {helper && <Helper title={helper} />}
    {meta && <span className="fr-hint-text"> {meta}</span>}
  </label>
);

export default Label;
