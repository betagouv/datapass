import React, { useContext, useMemo } from 'react';
import { Card } from '../../../molecules/Card';
import SelectInput from '../../../atoms/inputs/SelectInput';
import { FormContext } from '../../../templates/Form';
import TextInput from '../../../atoms/inputs/TextInput';
import TextInputWithSuggestions from '../../../molecules/TextInputWithSuggestions';

export const TechnicalTeamCard = ({ editorList = [] }) => {
  const {
    disabled,
    onChange,
    enrollment: { technical_team_type, technical_team_value },
  } = useContext(FormContext);

  const editorOptions = useMemo(
    () => editorList.map(({ siret, name }) => ({ id: siret, label: name })),
    [editorList]
  );

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
      <h3>Pour implémenter l‘API</h3>
      <SelectInput
        label="Qui va implémenter l’API ?"
        options={[
          { id: '', label: 'Sélectionner une option' },
          { id: 'internal_team', label: 'Développeurs en interne' },
          { id: 'software_company', label: 'Éditeur de logiciel' },
          { id: 'other', label: 'Autre' },
        ]}
        name="technical_team_type"
        value={technical_team_type}
        disabled={disabled}
        onChange={onTypeChange}
        required
      />
      {technical_team_type === 'software_company' && (
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
      {technical_team_type === 'other' && (
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
