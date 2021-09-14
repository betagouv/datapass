import React, { useContext, useEffect, useState } from 'react';
import { chain, isEmpty, isString, xor } from 'lodash';
import { FormContext } from '../../../../templates/Form';

const CUSTOM_USE_CASE_LABEL = 'Autre';

const UseCase = ({ availableScopes, useCases = [] }) => {
  const {
    disabled,
    onChange,
    enrollment: { scopes = {} },
  } = useContext(FormContext);

  const [selectedUseCase, selectUseCase] = useState(null);

  const handleUseCaseChange = (useCaseToBeSelected) => {
    if (
      isString(useCaseToBeSelected) &&
      useCaseToBeSelected !== CUSTOM_USE_CASE_LABEL
    ) {
      availableScopes.forEach(({ value: scopeValue }) =>
        onChange({
          target: {
            type: 'checkbox',
            checked: useCases
              .find((e) => e.label === useCaseToBeSelected)
              .scopes.includes(scopeValue),
            name: `scopes.${scopeValue}`,
          },
        })
      );

      return null;
    }

    availableScopes.forEach(({ value: scopeValue }) =>
      onChange({
        target: {
          type: 'checkbox',
          checked: false,
          name: `scopes.${scopeValue}`,
        },
      })
    );
  };

  useEffect(() => {
    // {'a': true, 'b': false, 'c': true} becomes ['a', 'c']
    const selectedScopesAsArray = chain(scopes)
      .omitBy((e) => !e)
      .keys()
      .value();

    const useCaseToSelect = useCases.find(({ scopes: useCaseScopes }) =>
      isEmpty(xor(selectedScopesAsArray, useCaseScopes))
    );

    selectUseCase(
      isEmpty(useCaseToSelect) ? CUSTOM_USE_CASE_LABEL : useCaseToSelect.label
    );
  }, [scopes, useCases]);

  return (
    <fieldset className="vertical">
      <legend>Sélectionnez votre cas d’usage :</legend>
      <div className="row">
        <div className="column">
          {useCases.map(({ label }) => (
            <div key={label}>
              <input
                type="radio"
                name="radio"
                id={label}
                checked={selectedUseCase === label}
                onChange={() => handleUseCaseChange(label)}
                disabled={disabled}
              />
              <label htmlFor={label} className="label-inline">
                {label}
              </label>
            </div>
          ))}
          <div>
            <input
              type="radio"
              name="radio"
              id="radio-other"
              checked={selectedUseCase === CUSTOM_USE_CASE_LABEL}
              onChange={() => handleUseCaseChange(CUSTOM_USE_CASE_LABEL)}
              disabled={disabled}
            />
            <label htmlFor="radio-other" className="label-inline">
              {CUSTOM_USE_CASE_LABEL}
            </label>
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default UseCase;
