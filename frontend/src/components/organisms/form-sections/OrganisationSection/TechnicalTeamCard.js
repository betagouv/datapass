import { isNumber } from 'lodash';
import React, { useContext, useEffect, useMemo } from 'react';
import Alert from '../../../atoms/Alert';
import Button from '../../../atoms/hyperTexts/Button';
import Link from '../../../atoms/hyperTexts/Link';
import RadioInput from '../../../atoms/inputs/RadioInput';
import TextInput from '../../../atoms/inputs/TextInput';
import { Card } from '../../../molecules/Card';
import { TextInputWithSuggestions } from '../../../molecules/TextInputWithSuggestions';
import { FormContext } from '../../../templates/Form';
import { HideSectionsContext } from '../../../templates/Form/HideSectionsContainer';

const typeOptions = [
  { id: 'software_company', label: 'Votre éditeur de logiciel' },
  { id: 'internal_team', label: 'Votre équipe de développeurs' },
  { id: 'other', label: 'Autre' },
];

export const TechnicalTeamCard = ({ editorList = [], sectionIndex }) => {
  const {
    disabled,
    onChange,
    isUserEnrollmentLoading,
    enrollment: { technical_team_type, technical_team_value },
  } = useContext(FormContext);

  const { setReadyForNextSteps, setLastIndexToShow } =
    useContext(HideSectionsContext);

  useEffect(() => {
    if (isNumber(sectionIndex)) {
      setLastIndexToShow(sectionIndex);
    }
  }, [setLastIndexToShow, sectionIndex]);

  const areInputValid = useMemo(() => {
    if (!technical_team_type) {
      return false;
    }
    if (technical_team_type === 'internal_team') {
      return true;
    }
    if (technical_team_value) {
      return true;
    }
    return false;
  }, [technical_team_type, technical_team_value]);

  useEffect(() => {
    !isUserEnrollmentLoading &&
      !disabled &&
      setReadyForNextSteps(areInputValid);
  }, [isUserEnrollmentLoading, disabled, setReadyForNextSteps, areInputValid]);

  const editorOptions = useMemo(
    () => editorList.map(({ siret, name }) => ({ id: siret, label: name })),
    [editorList]
  );

  const selectedTypeLabel = useMemo(
    () => typeOptions.find(({ id }) => id === technical_team_type)?.label,
    [technical_team_type]
  );

  const resetType = () => {
    onChange({
      target: { name: 'technical_team_type', value: '' },
    });
  };

  const onTypeChange = ({ target: { value } }) => {
    onChange({
      target: { name: 'technical_team_type', value },
    });
    onChange({
      target: { name: 'technical_team_value', value: '' },
    });
  };

  const technicalTeamValueLabel = useMemo(
    () =>
      editorList.find(({ siret }) => siret === technical_team_value)?.name ||
      technical_team_value,
    [editorList, technical_team_value]
  );

  const onValueChange = ({ target: { value: valueLabel } }) => {
    const value =
      editorList.find(({ name }) => name === valueLabel)?.siret || valueLabel;

    onChange({
      target: { name: 'technical_team_value', value: value },
    });
  };

  return (
    <Card>
      <h3>Qui implémentera l’API ?</h3>
      {!isUserEnrollmentLoading && !technical_team_type && (
        <>
          <div className="fr-mb-1w">
            <Alert>
              Pour lire les données vous aurez besoin d’un logiciel ou d’un
              service en ligne. <br />
              <Link href="/faq#champ-editeur" inline newTab>
                En savoir plus
              </Link>
            </Alert>
          </div>
          <RadioInput
            label="Qui s’occupera des aspects techniques et informatiques ?"
            options={typeOptions}
            name="technical_team_type"
            value={technical_team_type}
            disabled={disabled}
            onChange={onTypeChange}
            required
          />
        </>
      )}
      {!isUserEnrollmentLoading && technical_team_type && (
        <>
          {!disabled && (
            <div className="fr-mb-1w">
              <Button onClick={resetType} icon="arrow-left" secondary>
                retour
              </Button>
            </div>
          )}
          <RadioInput
            label="Qui s’occupera des aspects techniques et informatiques ?"
            options={[{ id: '', label: selectedTypeLabel }]}
            name="technical_team_type"
            value=""
            disabled={disabled}
            onChange={() => null}
            required
          />
        </>
      )}
      {!isUserEnrollmentLoading &&
        technical_team_type === 'software_company' && (
          <TextInputWithSuggestions
            label="Quel est votre éditeur de logiciel ?"
            options={editorOptions}
            name="technical_team_value"
            value={technicalTeamValueLabel}
            disabled={disabled}
            onChange={onValueChange}
            required
          />
        )}
      {!isUserEnrollmentLoading && technical_team_type === 'other' && (
        <TextInput
          label="Précisez ?"
          name="technical_team_value"
          value={technical_team_value}
          disabled={disabled}
          onChange={onChange}
          required
        />
      )}
    </Card>
  );
};

export default TechnicalTeamCard;
