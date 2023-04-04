import React from 'react';
import './style.css';

export type NoDSFRIcons =
  | 'activity'
  | 'change'
  | 'validation'
  | 'calendar'
  | 'mail'
  | 'target';

type Props = {
  title: string;
  icon: NoDSFRIcons;
  noBorder?: boolean;
};

export const IconTitle: React.FC<Props> = ({
  title,
  icon,
  noBorder = false,
}) => {
  let className = 'icon-title ';

  if (noBorder) {
    className += 'no-border ';
  }

  return (
    <div className={className}>
      <img src={`/images/${icon}.svg`} alt={icon} />
      <h3>{title}</h3>
    </div>
  );
};

export default IconTitle;
