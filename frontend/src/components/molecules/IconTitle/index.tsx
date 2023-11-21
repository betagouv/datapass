import React from 'react';
import './style.css';

export type NoDSFRIcons =
  | 'activity'
  | 'change'
  | 'validation'
  | 'calendar'
  | 'mail'
  | 'target'
  | 'draft'
  | 'validated'
  | 'pending';

type Props = {
  title: string;
  icon: NoDSFRIcons;
  noBorder?: boolean;
  small?: boolean;
};

export const IconTitle: React.FC<Props> = ({
  title,
  icon,
  noBorder = false,
  small = false,
}) => {
  let className = 'icon-title ';

  if (noBorder) {
    className += 'no-border ';
  }

  if (small) {
    className += 'small ';
  }

  return (
    <div className={className}>
      <img src={`/images/${icon}.svg`} alt={icon} />
      <h3>{title}</h3>
    </div>
  );
};

export default IconTitle;
