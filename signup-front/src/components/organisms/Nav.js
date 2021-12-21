import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ScrollableLink } from './Scrollable';
import { goBack } from '../../lib';
import { DATA_PROVIDER_LABELS } from '../../config/data-provider-parameters';
import Button from '../atoms/Button';

export const getDefaultDocumentationUrl = (target_api) =>
  `https://api.gouv.fr/les-api/${target_api.replace(/_/g, '-')}`;

export const DEFAULT_CONTACT_EMAIL = 'contact@api.gouv.fr';

const Nav = ({
  target_api,
  sectionLabels = [],
  contactEmail = '',
  documentationUrl,
  history,
}) => {
  const navElements = useMemo(
    () =>
      sectionLabels.map((sectionName) => ({
        id: encodeURIComponent(sectionName),
        label: sectionName,
      })),
    [sectionLabels]
  );

  const subject = useMemo(
    () =>
      contactEmail === DEFAULT_CONTACT_EMAIL
        ? `Contact%20via%20datapass.api.gouv.fr%20-%20${encodeURIComponent(
            DATA_PROVIDER_LABELS[target_api]
          )}`
        : 'Contact%20via%20datapass.api.gouv.fr',
    [contactEmail, target_api]
  );

  return (
    <nav
      className="fr-sidemenu fr-sidemenu--sticky-full-height"
      aria-label="Menu latéral"
    >
      <div className="fr-sidemenu__inner">
        <div className="fr-collapse" id="fr-sidemenu-wrapper">
          <Button
            onClick={() => goBack(history)}
            icon="arrow-left"
            style={{ margin: '1em 0' }}
          >
            Toutes mes demandes
          </Button>
          <div className="fr-sidemenu__title">
            <a href="#head">Formulaire</a>
          </div>
          <ul className="fr-sidemenu__list">
            {navElements.map(({ id, label }) => (
              <ScrollableLink key={id} scrollableId={id}>
                {label}
              </ScrollableLink>
            ))}
          </ul>
          <ul>
            <li style={{ marginTop: '1em' }}>
              <Button
                outline
                icon="mail"
                iconRight
                href={`mailto:${
                  contactEmail || DEFAULT_CONTACT_EMAIL
                }?subject=${subject}`}
              >
                Nous contacter
              </Button>
            </li>
            <li style={{ marginTop: '1em' }}>
              <Button
                href={documentationUrl}
                outline
                icon="file"
                iconRight
                target="_blank"
                rel="noreferrer noopener"
              >
                Documentation
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

Nav.propTypes = {
  sectionLabels: PropTypes.array.isRequired,
  contactEmail: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        fromList: PropTypes.bool,
      }),
    }),
  }),
};

export default withRouter(Nav);
