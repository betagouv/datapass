import React from 'react';
import './FieldsetWrapper.css';

export const FieldsetWrapper = ({
  title,
  required = false,
  grid = false,
  inline = false,
  small = false,
  children,
}) => {
  return (
    <div className={small ? 'fr-checkbox-group--sm' : 'fr-form-group'}>
      <fieldset
        className={`fr-fieldset${grid ? ' datapass_fieldset_grid' : ''}${
          inline ? ' fr-fieldset--inline' : ''
        }`}
      >
        {title && (
          <legend className="fr-fieldset__legend fr-text--regular">
            {title}
            {required && ' *'}
          </legend>
        )}
        <div className="fr-fieldset__content" role="listbox">
          {children}
        </div>
      </fieldset>
    </div>
  );
};

export default FieldsetWrapper;
