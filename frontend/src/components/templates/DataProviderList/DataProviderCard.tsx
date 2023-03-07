import React from 'react';
import Link from '../../atoms/hyperTexts/Link';
import Button from '../../atoms/hyperTexts/Button';
import './DataProviderCard.css';

type Props = {
  label: string;
  iconPath: string;
  passPath: string;
  description?: string;
  aboutLink?: string;
};

export const DataProviderCard: React.FunctionComponent<Props> = ({
  label,
  iconPath,
  passPath,
  description,
  aboutLink,
}) => (
  <div className="data-provider-card">
    {iconPath && (
      <div className="data-provider-logo">
        <img src={iconPath} alt={`logo ${label}`} />
      </div>
    )}
    <div className="data-provider-content">
      <div>
        <b>{label}</b>
      </div>
      <div className="data-provider-description">
        {description}{' '}
        {aboutLink && (
          <>
            (
            <Link inline newTab href={aboutLink}>
              en savoir plus
            </Link>
            )
          </>
        )}
      </div>
    </div>
    <div className="data-provider-cta">
      <Button href={passPath}>Remplir une demande</Button>
    </div>
  </div>
);
