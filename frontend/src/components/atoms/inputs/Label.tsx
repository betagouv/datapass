import React, { FunctionComponent, ReactNode } from 'react';
import Helper from '../Helper';

type Props = {
  id: string;
  label: ReactNode;
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
    {label}
    {required ? ' *' : ''}
    {helper && <Helper title={helper} />}
    {meta && <span className="fr-hint-text"> {meta}</span>}
  </label>
);

export default Label;
