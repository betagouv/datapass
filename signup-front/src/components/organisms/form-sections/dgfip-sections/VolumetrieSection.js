import React, { useContext, useEffect } from 'react';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import Quote from '../../../atoms/inputs/Quote';
import Select from '../../../atoms/inputs/Select';

const SECTION_LABEL = 'Volumétrie';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const VolumetrieSection = ({ options = [50, 200, 1000] }) => {
  const {
    disabled,
    isUserEnrollmentLoading,
    onChange,
    enrollment: {
      additional_content: { volumetrie_appels_par_minute = '' },
    },
  } = useContext(FormContext);

  useEffect(() => {
    // initialize volumetrie_appels_par_minute if needed
    if (
      !isUserEnrollmentLoading &&
      !disabled &&
      !volumetrie_appels_par_minute
    ) {
      onChange({
        target: {
          name: 'additional_content.volumetrie_appels_par_minute',
          value: options[0],
        },
      });
    }
  }, [
    options,
    isUserEnrollmentLoading,
    volumetrie_appels_par_minute,
    disabled,
    onChange,
  ]);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Volumétrie</h2>
      <Quote>
        <p>
          Connaître les données relatives à la volumétrie de votre téléservice
          nous permet de vous offrir la meilleure qualité de service possible.
          Ces informations sont transmises aux fournisseurs de vos données pour
          prévenir les pics de charges.
        </p>
        <p>
          Conformément aux modalités d’utilisation, nous nous réservons le droit
          de réduire ou couper les appels autorisés au fournisseur de service.
        </p>
      </Quote>
      <Select
        label="Quel est la limitation de debit que vous souhaitez pour votre téléservice ?"
        name="additional_content.volumetrie_appels_par_minute"
        options={options.map((appelsParMinute) => ({
          id: appelsParMinute,
          label: `${appelsParMinute} appels / minute`,
        }))}
        value={volumetrie_appels_par_minute}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

VolumetrieSection.sectionLabel = SECTION_LABEL;

export default VolumetrieSection;
