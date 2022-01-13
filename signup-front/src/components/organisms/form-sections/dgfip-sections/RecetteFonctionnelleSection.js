import React, { useContext } from 'react';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';

const SECTION_LABEL = 'La recette fonctionnelle';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const RecetteFonctionnelleSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      additional_content: { recette_fonctionnelle = '' },
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>La recette fonctionnelle</h2>
      <ExpandableQuote title="Comment effectuer une recette fonctionnelle ?">
        <p>
          La qualification de votre téléservice est obligatoire tant pour votre
          homologation de sécurité ou vos obligations RGPD que pour demander
          l’entrée en production auprès de la DGFiP.
        </p>
        <p>
          Pour vous accompagner dans vos travaux, un environnement de test est
          mis à votre disposition sur le portail des API de la DGFiP.
        </p>
        <p>
          Le périmètre des réponses de cet environnement de test est
          fonctionnellement identique à l’environnement de production.
        </p>
        <p>
          Un jeu de données fictives vous permet de valider l’intégration de
          quelques cas fonctionnels dans votre téléservice. L’environnement de
          test proposé par la DGFiP n’a donc pas vocation à recetter toutes les
          fonctionnalités du téléservice, qui doivent faire l’objet d’une
          recette interne.
        </p>
        <p>
          A l’issue de vos travaux, veuillez attester de la qualification de
          votre téléservice.
        </p>
      </ExpandableQuote>
      <CheckboxInput
        label="J’atteste avoir réalisé une recette fonctionnelle et qualifié mon téléservice."
        name="additional_content.recette_fonctionnelle"
        value={recette_fonctionnelle}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

RecetteFonctionnelleSection.sectionLabel = SECTION_LABEL;

export default RecetteFonctionnelleSection;
