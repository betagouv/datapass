import React from 'react';
import './FieldsetWrapper.css';

export const FieldsetWrapper = ({
  title,
  required,
  grid = false,
  inline = false,
  children,
}) => {
  return (
    <div className="fr-form-group">
      <fieldset
        className={`fr-fieldset ${grid && 'datapass_fieldset_grid'} ${
          inline && 'fr-fieldset--inline'
        }`}
      >
        {title && (
          <legend className="fr-fieldset__legend">
            {title}
            {required && ' *'}
          </legend>
        )}
        <div className="fr-fieldset__content">{children}</div>
      </fieldset>
    </div>
  );
};

export default FieldsetWrapper;
