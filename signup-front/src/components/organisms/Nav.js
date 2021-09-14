import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ScrollableLink } from './Scrollable';
import { goBack } from '../../lib';
import { TARGET_API_LABELS } from '../../lib/api';
import { isEmpty } from 'lodash';
import Button from '../atoms/Button';

const Nav = ({
  target_api,
  documentationUrl,
  sectionLabels = [],
  contactInformation = [],
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

  const contactElements = useMemo(
    () =>
      isEmpty(contactInformation)
        ? [
            {
              email: 'contact@api.gouv.fr',
              label: 'Nous contacter',
              subject: `Contact%20via%20datapass.api.gouv.fr%20-%20${encodeURIComponent(
                TARGET_API_LABELS[target_api]
              )}`,
            },
          ]
        : contactInformation,
    [contactInformation, target_api]
  );

  const defaultedDocumentationUrl = useMemo(() => {
    return documentationUrl
      ? documentationUrl
      : `https://api.gouv.fr/les-api/${target_api.replace(/_/g, '-')}`;
  }, [documentationUrl, target_api]);

  return (
    <nav
      className="fr-sidemenu fr-sidemenu--sticky-full-height"
      aria-label="Menu latéral"
    >
      <div className="fr-sidemenu__inner">
        <div className="fr-collapse" id="fr-sidemenu-wrapper">
          <Button
            onClick={() => goBack(history)}
            type="light"
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
            {contactElements.map(({ tel, email, label, subject }) =>
              tel ? (
                <li key={label} style={{ marginTop: '1em' }}>
                  <Button
                    key={tel}
                    outline
                    icon="phone"
                    iconRight
                    href={`tel:${tel}`}
                  >
                    {tel}
                  </Button>
                </li>
              ) : (
                <li key={label} style={{ marginTop: '1em' }}>
                  <Button
                    key={label}
                    outline
                    icon="mail"
                    iconRight
                    href={`mailto:${email}?subject=${subject}`}
                  >
                    {label}
                  </Button>
                </li>
              )
            )}
            <li style={{ marginTop: '1em' }}>
              <Button
                href={defaultedDocumentationUrl}
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
  contactInformation: PropTypes.array,
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
