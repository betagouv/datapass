import React from 'react';
import ListHeader from '../../molecules/ListHeader';
import { DataProviderCard } from './DataProviderCard';
import Button from '../../atoms/hyperTexts/Button';
import useListItemNavigation from '../hooks/use-list-item-navigation';
import { useDataProviderConfigurations } from '../hooks/use-data-provider-configurations';

const DataProviders = [
  { target_api: 'hubee_portail', description: 'Certificats de Décès' },
  {
    target_api: 'hubee_portail_dila',
    description:
      "Acte d’État Civil, Démarche en ligne de préparation à la conclusion d’un Pacs, Recensement Citoyen Obligatoire, Déclaration d'hébergement touristique, Déclaration de Changement de Coordonnées",
  },
];

export const DataProviderList = () => {
  const { goBackToList } = useListItemNavigation();
  const { dataProviderConfigurations } = useDataProviderConfigurations();

  return (
    <main className="list-page">
      <ListHeader title="Demander une nouvelle habilitation" />

      <div className="page-container list-container">
        <div className="list-title">
          <Button onClick={() => goBackToList()} secondary icon="arrow-left">
            retour
          </Button>
        </div>
        {dataProviderConfigurations &&
          DataProviders.map(({ target_api, description }) => (
            <DataProviderCard
              key={target_api}
              label={dataProviderConfigurations?.[target_api].label}
              iconPath={`/images/logo-hubee-small.png`}
              passPath={`/${target_api}`}
              description={description}
              aboutLink="https://hubee.numerique.gouv.fr"
            />
          ))}
      </div>
    </main>
  );
};

export default DataProviderList;
