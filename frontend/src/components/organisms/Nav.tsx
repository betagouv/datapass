import React, { useMemo } from 'react';
import { useDataProvider } from '../templates/hooks/use-data-provider';
import { ScrollableLink } from './Scrollable';
import Button from '../atoms/hyperTexts/Button';
import useListItemNavigation from '../templates/hooks/use-list-item-navigation';
import Link from '../atoms/hyperTexts/Link';
import { TargetAPI } from '../../config/data-provider-configurations';

export const getDefaultDocumentationUrl = (target_api: TargetAPI) =>
  `https://api.gouv.fr/les-api/${target_api.replace(/_/g, '-')}`;

export const DEFAULT_CONTACT_EMAIL = 'datapass@api.gouv.fr';

type NavProps = {
  target_api: TargetAPI;
  sectionLabels: string[];
  contactEmail: string;
  documentationUrl: string;
};

const Nav: React.FC<NavProps> = ({
  target_api,
  sectionLabels = [],
  contactEmail,
  documentationUrl,
}) => {
  const { goBackToList } = useListItemNavigation();
  const { label } = useDataProvider(target_api);

  const navElements = useMemo(
    () =>
      sectionLabels.map((sectionName) => ({
        id: encodeURIComponent(sectionName),
        label: sectionName,
      })),
    [sectionLabels]
  );

  const contactLink = useMemo(
    () =>
      !contactEmail || contactEmail === DEFAULT_CONTACT_EMAIL
        ? `mailto:${DEFAULT_CONTACT_EMAIL}?subject=Contact%20via%20datapass.api.gouv.fr%20-%20${encodeURIComponent(
            label
          )}`
        : `mailto:${contactEmail}?subject=Contact%20via%20datapass.api.gouv.fr`,
    [contactEmail, label]
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
            secondary
            icon="arrow-left"
            className="fr-my-2w"
          >
            Toutes mes habilitations
          </Button>
          <div className="fr-sidemenu__title">
            <Link inline href="#head">
              Formulaire
            </Link>
          </div>
          <ul className="fr-sidemenu__list">
            {navElements.map(({ id, label }) => (
              <ScrollableLink key={id} scrollableId={id}>
                {label}
              </ScrollableLink>
            ))}
          </ul>
          <ul>
            <li className="fr-mt-2w">
              <Button secondary icon="mail" iconRight href={contactLink}>
                Nous contacter
              </Button>
            </li>
            <li className="fr-mt-2w">
              <Button
                href={documentationUrl}
                secondary
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
