import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { chain, difference, groupBy, isEmpty, zipObject } from 'lodash';
import { ScrollablePanel } from '../../Scrollable';
import Scopes from './Scopes';
import { FormContext } from '../../../templates/Form';
import ExpandableQuote from '../../../atoms/inputs/ExpandableQuote';
import TextInput from '../../../atoms/inputs/TextInput';
import NumberInput from '../../../atoms/inputs/NumberInput';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';
import FileInput from '../../../molecules/FileInput';
import Link from '../../../atoms/hyperTexts/Link';

const SECTION_LABEL = 'Les données nécessaires';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const DonneesSection = ({
  DonneesDescription,
  availableScopes = [],
  AvailableScopesDescription,
  accessModes,
  enableFileSubmissionForScopeSelection = false,
}) => {
  const {
    disabled,
    onChange,
    enrollment: {
      scopes = {},
      data_recipients = '',
      data_retention_period = '',
      data_retention_comment = '',
      additional_content = {},
      documents = [],
      documents_attributes = [],
    },
  } = useContext(FormContext);

  useEffect(() => {
    if (!isEmpty(availableScopes) && isEmpty(scopes)) {
      onChange({
        target: {
          name: 'scopes',
          value: zipObject(
            availableScopes.map(({ value }) => value),
            availableScopes.map(
              ({ required, checkedByDefault }) =>
                !!required || !!checkedByDefault
            )
          ),
        },
      });
    }
  });

  const groupTitleScopesGroup = groupBy(
    availableScopes,
    (e) => e.groupTitle || 'default'
  );

  // {'a': true, 'b': false, 'c': true} becomes ['a', 'c']
  const scopesAsArray = chain(scopes)
    .omitBy((e) => !e)
    .keys()
    .value();
  const availableScopesAsArray = availableScopes.map(({ value }) => value);
  const outdatedScopes = difference(scopesAsArray, availableScopesAsArray);

  const [isFileInputExpanded, setFileInputExpanded] = useState(
    enableFileSubmissionForScopeSelection &&
      !isEmpty(
        documents.filter(
          ({ type }) => type === 'Document::ExpressionBesoinSpecifique'
        )
      )
  );

  useEffect(() => {
    const hasDocument = !isEmpty(
      documents.filter(
        ({ type }) => type === 'Document::ExpressionBesoinSpecifique'
      )
    );
    if (
      enableFileSubmissionForScopeSelection &&
      !isFileInputExpanded &&
      hasDocument
    ) {
      setFileInputExpanded(true);
    }
  }, [enableFileSubmissionForScopeSelection, isFileInputExpanded, documents]);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Les données nécessaires</h2>
      {DonneesDescription && (
        <ExpandableQuote title="Comment choisir les données ?">
          <DonneesDescription />
        </ExpandableQuote>
      )}
      {AvailableScopesDescription && <AvailableScopesDescription />}
      {!isEmpty(availableScopes) && (
        <>
          <h3>À quelles données souhaitez-vous avoir accès ?</h3>
          {Object.keys(groupTitleScopesGroup).map((group) => (
            <Scopes
              key={group}
              title={group === 'default' ? null : group}
              scopes={groupTitleScopesGroup[group]}
              selectedScopes={scopes}
              disabledApplication={disabled}
              handleChange={onChange}
            />
          ))}
          {disabled && !isEmpty(outdatedScopes) && (
            <Scopes
              title="Les données suivantes ont été sélectionnées mais ne sont plus disponibles :"
              scopes={outdatedScopes.map((value) => ({ value, label: value }))}
              selectedScopes={zipObject(
                outdatedScopes,
                Array(outdatedScopes.length).fill(true)
              )}
              disabledApplication
              handleChange={() => null}
            />
          )}
        </>
      )}
      {enableFileSubmissionForScopeSelection && (
        <>
          <ExpandableQuote title="J’ai une expression de besoin spécifique ?">
            <p>
              Les partenaires ayant convenu avec la DGFiP un périmètre de
              données particulier peuvent rattacher leur expression de besoin
              listant l’ensemble des données strictement nécessaires à leur cas
              d’usage.
            </p>
            <CheckboxInput
              label="J’ai une expression de besoin spécifique"
              value={isFileInputExpanded}
              onChange={() => setFileInputExpanded(!isFileInputExpanded)}
              disabled={disabled}
            />
          </ExpandableQuote>
          {isFileInputExpanded && (
            <>
              <FileInput
                label="Joindre l’expression de besoin"
                meta={
                  'Attention : seule l’expression de besoin en données ayant déjà été partagée avec la DGFiP peut être rattachée à votre demande.'
                }
                mimeTypes="*"
                disabled={disabled}
                uploadedDocuments={documents}
                documentsToUpload={documents_attributes}
                documentType={'Document::ExpressionBesoinSpecifique'}
                onChange={onChange}
              />
            </>
          )}
        </>
      )}
      {!isEmpty(accessModes) && (
        <>
          <h3>Comment souhaitez-vous accéder à l’API ?</h3>
          {accessModes.map(({ id, label }) => (
            <CheckboxInput
              key={id}
              label={label}
              name={`additional_content.${id}`}
              value={additional_content[id] || false}
              disabled={disabled}
              onChange={onChange}
            />
          ))}
        </>
      )}
      <h3>Comment seront traitées ces données personnelles ?</h3>
      <TextInput
        label="Destinataires des données"
        placeholder={
          '« agents instructeurs des demandes d’aides », « usagers des ' +
          'services publics de la ville », etc.'
        }
        meta={
          <Link
            inline
            newTab
            href="https://www.cnil.fr/fr/definition/destinataire"
            aria-label="Voir la définition CNIL du destinataire des données"
          >
            Plus d’infos
          </Link>
        }
        name="data_recipients"
        value={data_recipients}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <NumberInput
        label="Durée de conservation des données en mois"
        meta={
          <Link
            inline
            newTab
            href="https://www.cnil.fr/fr/les-durees-de-conservation-des-donnees"
            aria-label="Voir l’explication CNIL sur les durées de conservation des données"
          >
            Plus d’infos
          </Link>
        }
        name="data_retention_period"
        value={data_retention_period}
        disabled={disabled}
        onChange={onChange}
        required
      />
      {data_retention_period > 36 && (
        <>
          <div className="notification warning">
            Cette durée excède la durée communément constatée (36 mois).
          </div>
          <TextInput
            label="Veuillez justifier cette durée dans le champ ci-après :"
            name="data_retention_comment"
            value={data_retention_comment}
            disabled={disabled}
            onChange={onChange}
          />
        </>
      )}
    </ScrollablePanel>
  );
};

DonneesSection.sectionLabel = SECTION_LABEL;

DonneesSection.propTypes = {
  DonneesDescription: PropTypes.func,
  availableScopes: PropTypes.array,
};

export default DonneesSection;
