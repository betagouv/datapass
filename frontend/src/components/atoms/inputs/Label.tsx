import React, { FunctionComponent } from 'react';
import Helper from '../Helper';

type Props = {
  id: string;
  label: string;
  required?: boolean;
  helper?: string;
  meta?: string;
};

export const Label: FunctionComponent<Props> = ({
  id,
  label,
  required,
  helper,
  meta,
}) => (
  <label className="fr-label" htmlFor={id}>
    <span>
      {label}
      {required ? ' *' : ''}
      {helper && <Helper title={helper} />}
      {meta && <span className="fr-hint-text"> {meta}</span>}
    </span>
  </label>
);

export default Label;
