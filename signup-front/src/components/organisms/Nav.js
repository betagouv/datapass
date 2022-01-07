import React, { useMemo } from 'react';
import { ScrollableLink } from './Scrollable';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import Button from '../atoms/Button';
import useListItemNavigation from '../templates/hooks/use-list-item-navigation';

export const getDefaultDocumentationUrl = (target_api) =>
  `https://api.gouv.fr/les-api/${target_api.replace(/_/g, '-')}`;

export const DEFAULT_CONTACT_EMAIL = 'contact@api.gouv.fr';

const Nav = ({
  target_api,
  sectionLabels = [],
  contactEmail = '',
  documentationUrl,
}) => {
  const { goBackToList } = useListItemNavigation();

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
            DATA_PROVIDER_PARAMETERS[target_api]?.label
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
            onClick={() => goBackToList()}
            outline
            icon="arrow-left"
            style={{ margin: '1em 0' }}
          >
            Toutes mes habilitations
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

export default Nav;
