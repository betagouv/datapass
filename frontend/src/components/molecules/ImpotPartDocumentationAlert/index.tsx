import React from 'react';
import Highlight from '../../atoms/Highlight';
import Button from '../../atoms/hyperTexts/Button';

export const ImpotPartDocumentationAlert: React.FC = () => (
  <Highlight title="Mode de fonctionnement de l’API Impôt particulier">
    <div style={{ width: '70%', marginBottom: '20px' }}>
      Afin de vous accompagner dans le choix de vos données, vous pouvez
      consulter notre documentation qui vous permettra de comprendre le
      fonctionnement de notre API ainsi que les données que nous proposons. Afin
      de respecter les principes de collecte, traitement et conservation données
      définit par l’article 4 de la loi informatique et libertés, vous devez
      devez sélectionner uniquement les données strictement nécessaires à votre
      téléservice.
    </div>
    <Button
      icon="file"
      iconRight
      target="_blank"
      rel="noreferrer noopener"
      href="https://datapass.api.gouv.fr/docs/presentation_de_l_api_impot_particulier_v2.7.pdf"
    >
      Voir la documentation de l’API Impôt particulier
    </Button>
  </Highlight>
);

export default ImpotPartDocumentationAlert;
