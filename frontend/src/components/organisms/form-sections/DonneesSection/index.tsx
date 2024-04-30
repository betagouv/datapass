import React, { ComponentType, useContext, useEffect, useState } from 'react';
import { chain, difference, isEmpty, zipObject } from 'lodash';
import { ScrollablePanel } from '../../Scrollable';
import Scopes, { ScopeConfiguration } from './Scopes';
import { FormContext } from '../../../templates/Form';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import TextInput from '../../../atoms/inputs/TextInput';
import NumberInput from '../../../atoms/inputs/NumberInput';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';
import FileInput from '../../../molecules/FileInput';
import Link from '../../../atoms/hyperTexts/Link';
import Alert, { AlertType } from '../../../atoms/Alert';
import { FunctionSectionComponent } from '../../../../types/fonction-section-component';

const SECTION_LABEL = 'Les données nécessaires';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

type Props = {
  donneesTitle?: string;
  DonneesDescription?: ComponentType;
  DonneesDocumentation?: ComponentType;
  scopesConfiguration?: ScopeConfiguration[];
  groups?: { [k: string]: { label: string; scopes: string[] } };
  ScopesDescription?: ComponentType;
  accessModes?: { id: string; label: string }[];
  enableFileSubmissionForScopeSelection?: boolean;
};

const DonneesSection: FunctionSectionComponent<Props> = ({
  donneesTitle = 'À quelles données souhaitez-vous avoir accès ?',
  DonneesDescription,
  DonneesDocumentation,
  scopesConfiguration = [],
  groups,
  ScopesDescription,
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
      created_at = '',
      target_api = '',
    },
  } = useContext(FormContext)!;

  useEffect(() => {
    if (!isEmpty(scopesConfiguration) && isEmpty(scopes)) {
      onChange({
        target: {
          name: 'scopes',
          value: zipObject(
            scopesConfiguration.map(({ value }) => value),
            scopesConfiguration.map(
              ({ required, checkedByDefault }) =>
                !!required || !!checkedByDefault
            )
          ),
        },
      });
    }
  });

  // {'a': true, 'b': false, 'c': true} becomes ['a', 'c']
  const scopesAsArray = chain(scopes)
    .omitBy((e) => !e)
    .keys()
    .value();
  const scopesConfigurationAsArray = scopesConfiguration.map(
    ({ value }) => value
  );
  const outdatedScopes = difference(scopesAsArray, scopesConfigurationAsArray);

  const [isFileInputExpanded, setFileInputExpanded] = useState(
    enableFileSubmissionForScopeSelection &&
      !isEmpty(
        documents.filter(
          ({ type }) => type === 'Document::ExpressionBesoinSpecifique'
        )
      )
  );

  function shouldDisplayAccessImpotPart(
    created_at: string,
    target_api: string
  ): boolean {
    const targetDate = new Date('2024-05-02');
    const createdDate = new Date(created_at);

    if (
      isEmpty(created_at) ||
      ([
        'api_impot_particulier_sandbox',
        'api_impot_particulier_unique',
      ].includes(target_api) &&
        targetDate < createdDate)
    ) {
      return false;
    }
    return true;
  }

  const [displayAccessImpotPart, setDisplayAccessImpotPart] = useState(false);

  useEffect(() => {
    setDisplayAccessImpotPart(
      shouldDisplayAccessImpotPart(created_at, target_api)
    );
  }, [created_at, target_api]);

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
      {DonneesDocumentation && (
        <div style={{ marginBottom: '30px' }}>
          <DonneesDocumentation />
        </div>
      )}
      {DonneesDescription && (
        <ExpandableQuote title="Comment choisir les données ?">
          <DonneesDescription />
        </ExpandableQuote>
      )}
      {ScopesDescription && <ScopesDescription />}
      {!isEmpty(scopesConfiguration) && (
        <>
          <h3>{donneesTitle}</h3>
          {!isEmpty(groups) ? (
            Object.entries(groups!).map(
              ([key, { label, scopes: scopesInGroup }]) => {
                return (
                  <Scopes
                    key={key}
                    title={label}
                    scopesConfiguration={scopesInGroup.map(
                      (scopeValue) =>
                        scopesConfiguration.find(
                          ({ value }) => value === scopeValue
                        )!
                    )}
                    scopes={scopes}
                    disabled={disabled}
                    handleChange={onChange}
                  />
                );
              }
            )
          ) : (
            <Scopes
              scopesConfiguration={scopesConfiguration}
              scopes={scopes}
              disabled={disabled}
              handleChange={onChange}
            />
          )}
          {!isEmpty(outdatedScopes) && (
            <Scopes
              title="Les données suivantes ont été sélectionnées mais ne sont plus disponibles :"
              scopesConfiguration={outdatedScopes.map((value) => ({
                value,
                label: value,
              }))}
              scopes={zipObject(
                outdatedScopes,
                Array(outdatedScopes.length).fill(true)
              )}
              disabled={disabled}
              handleChange={onChange}
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
              d’usage. Si vous n'avez pas encore contacté la DGFiP, vous pouvez
              les joindre à l'adresse{' '}
              <Link
                inline
                href="mailto:dtnum.donnees.demande-acces@dgfip.finances.gouv.fr?subject=Expression%20de%20besoin%20spécifique"
              >
                dtnum.donnees.demande-acces@dgfip.finances.gouv.fr
              </Link>
            </p>
            <CheckboxInput
              label="J’ai une expression de besoin spécifique"
              value={isFileInputExpanded}
              onChange={() => {
                setFileInputExpanded(!isFileInputExpanded);
              }}
              disabled={disabled}
            />
          </ExpandableQuote>
          {isFileInputExpanded && (
            <>
              <FileInput
                label="Joindre l’expression de besoin"
                meta={
                  'Attention : seule l’expression de besoin en données ayant déjà été partagée avec la DGFiP peut être rattachée à votre habilitation.'
                }
                mimeTypes=".ods, .xls, .xlsx, .sxc"
                disabled={disabled}
                uploadedDocuments={documents}
                documentsToUpload={documents_attributes}
                documentType={'Document::ExpressionBesoinSpecifique'}
                onChange={(value) => {
                  onChange({
                    target: {
                      value: !!value,
                      name: 'additional_content.specific_requirements',
                    },
                  });
                  onChange(value);
                }}
              />
            </>
          )}
        </>
      )}
      {displayAccessImpotPart && !isEmpty(accessModes) && (
        <>
          <h3>Comment souhaitez-vous y accéder ?</h3>
          {accessModes!.map(({ id, label }) => (
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
      {Number(data_retention_period) > 36 && (
        <>
          <Alert type={AlertType.warning} title="Attention">
            Cette durée excède la durée communément constatée (36 mois).
          </Alert>
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

export default DonneesSection;
