import React from 'react';
import Card from '../Card';
import IconTitle, { NoDSFRIcons } from '../IconTitle';
import './styles.css';

type Stats = {
  main: {
    value: string | number;
    label: string;
  };
  second: {
    value: string | number;
    label: string;
  };
};

type Props = {
  title: string;
  icon: NoDSFRIcons;
  stats: Stats;
  noBorder?: boolean;
  negative?: boolean;
};

export const StatCard: React.FC<Props> = ({
  title,
  icon,
  stats,
  negative = false,
}) => {
  let secondStatisticClassNames = 'stat-card-second-statistic ';

  if (negative) {
    secondStatisticClassNames += 'negative ';
  }

  return (
    <Card className="stat-card">
      <IconTitle noBorder title={title} icon={icon} />
      <div className="stat-card-main">
        <div className="stat-card-main-statistic">{stats.main.value}</div>
        <div className="stat-card-main-description">{stats.main.label}</div>
      </div>
      <div className="stat-card-second">
        <div className={secondStatisticClassNames}>
          {stats.second.value < 0 ? '' : '+'}
          {stats.second.value}
        </div>
        <div className="stat-card-second-description">{stats.second.label}</div>
      </div>
    </Card>
  );
};

export default StatCard;
