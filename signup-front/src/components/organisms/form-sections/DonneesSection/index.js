import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { chain, difference, groupBy, isEmpty, zipObject } from 'lodash';
import { ScrollablePanel } from '../../Scrollable';
import Scopes from './Scopes';
import { FormContext } from '../../../templates/Form';
import ExpandableQuote from '../../../atoms/inputs/ExpandableQuote';
import TextInput from '../../../atoms/inputs/TextInput';
import NumberInput from '../../../atoms/inputs/NumberInput';

const SECTION_LABEL = 'Les données nécessaires';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const DonneesSection = ({
  DonneesDescription,
  availableScopes = [],
  AvailableScopesDescription,
}) => {
  const {
    disabled,
    onChange,
    enrollment: {
      scopes = {},
      data_recipients = '',
      data_retention_period = '',
      data_retention_comment = '',
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
              ({ mandatory, checkedByDefault }) =>
                !!mandatory || !!checkedByDefault
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

  const hasDefaultGroup = availableScopes.some((e) => !e.groupTitle);

  // {'a': true, 'b': false, 'c': true} becomes ['a', 'c']
  const scopesAsArray = chain(scopes)
    .omitBy((e) => !e)
    .keys()
    .value();
  const availableScopesAsArray = availableScopes.map(({ value }) => value);
  const outdatedScopes = difference(scopesAsArray, availableScopesAsArray);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Les données nécessaires</h2>
      {DonneesDescription && (
        <ExpandableQuote title="Comment choisir les données ?">
          <DonneesDescription />
        </ExpandableQuote>
      )}
      {AvailableScopesDescription && (
        <div className="form__group">
          <AvailableScopesDescription />
        </div>
      )}
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
              useCategoryStyle={!hasDefaultGroup}
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
      <h3>Comment seront traitées ces données personnelles ?</h3>
      <TextInput
        label="Destinataires des données"
        placeholder={
          '« agents instructeurs des demandes d’aides », « usagers des ' +
          'services publics de la ville », etc.'
        }
        meta={
          <a
            href="https://www.cnil.fr/fr/definition/destinataire"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Voir la définition CNIL du destinataire des données"
          >
            Plus d’infos
          </a>
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
          <a
            href="https://www.cnil.fr/fr/les-durees-de-conservation-des-donnees"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Voir l’explication CNIL sur les durées de conservation des données"
          >
            Plus d’infos
          </a>
        }
        name="data_retention_period"
        value={data_retention_period}
        disabled={disabled}
        onChange={onChange}
        required
      />
      {data_retention_period > 36 && (
        <>
          <div className="form__group">
            <div className="notification warning">
              Cette durée excède la durée communément constatée (36 mois).
            </div>
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
  AdditionalRgpdAgreement: PropTypes.func,
  DonneesFootnote: PropTypes.func,
  scopesLabel: PropTypes.string,
  availableScopes: PropTypes.array,
};

export default DonneesSection;
