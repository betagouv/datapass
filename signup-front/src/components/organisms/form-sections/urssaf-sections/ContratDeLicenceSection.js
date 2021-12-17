import React from 'react';
import { ScrollablePanel } from '../../Scrollable';

const SECTION_LABEL = 'Le contrat de licence';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const ContratDeLicenceSection = () => (
  <ScrollablePanel scrollableId={SECTION_ID}>
    <h2>{SECTION_LABEL}</h2>
    <p>
      Suite à la soumission de votre demande via ce formulaire, l’Urssaf va
      analyser et valider ou non votre demande. L’octroi de cette habilitation
      est conditionné entre-autre au respect par le demandeur de ses obligations
      fiscales et sociales et à l’adéquation du service proposé avec l’objet de
      l’API.
    </p>
    <p>
      Si votre demande est validée, vous recevrez par mail une licence à signer.
      Sa signature devra impérativement être réalisée électroniquement par un
      dispositif certifié.
    </p>
    <p>
      Dans le cas où votre organisme n’aurait pas de dispositif de signature
      électronique, l’outil Docusign (
      <a
        href={'https://www.docusign.fr'}
        target="_blank"
        rel="noopener noreferrer"
      >
        https://www.docusign.fr
      </a>
      ) offre par exemple un accès de 30 jours à sa plateforme de signature.
    </p>
    <p>
      Il vous suffira de cliquer sur « Essai gratuit » en haut à droite de la
      page Web, de créer un compte et de l’activer. Une fois cela fait, vous
      devrez déposer votre document sur la page, cocher la case « Je suis le
      seul signataire » et suivre les instructions. Vous pourrez utiliser le
      champ « Signature » présent dans le menu à gauche pour déposer votre
      signature sur le document
    </p>
  </ScrollablePanel>
);

ContratDeLicenceSection.sectionLabel = SECTION_LABEL;

export default ContratDeLicenceSection;
