import React from 'react';
import Highlight from '../../atoms/Highlight';
import Button from '../../atoms/hyperTexts/Button';
import './style.css';

export const ApiRialDocumentationAlert: React.FC = () => (
  <Highlight title="Mode de fonctionnement de l’API Rial">
    <div className="api-rial-doc-alert">
      L’API restitue toutes les données sans restrictions. Vous pouvez consulter
      notre documentation qui vous permettra de comprendre le fonctionnement de
      notre API ainsi que les données que nous proposons.
    </div>
    <Button
      icon="file"
      iconRight
      target="_blank"
      rel="noreferrer noopener"
      href="https://datapass.api.gouv.fr/docs/documentation_api_rial_v2024_11-1.pdf"
    >
      Voir la documentation fonctionnelle de l’API Rial
    </Button>
  </Highlight>
);

export default ApiRialDocumentationAlert;
