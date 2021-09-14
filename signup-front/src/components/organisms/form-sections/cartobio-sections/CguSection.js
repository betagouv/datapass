import React, { useContext } from 'react';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';

const SECTION_LABEL = 'Modalités d’utilisation';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const CguSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      additional_content: {
        secret_statistique_agreement = false,
        partage_agreement = false,
        protection_agreement = false,
        exhaustivite_agreement = false,
        information_agreement = false,
      },
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Modalités d’utilisation</h2>
      <CheckboxInput
        label={
          <>
            Je m’engage à respecter le secret statistique des données transmises
            lors d’une communication publique.
          </>
        }
        name="additional_content.secret_statistique_agreement"
        value={secret_statistique_agreement}
        disabled={disabled}
        onChange={onChange}
      />
      <CheckboxInput
        label={
          <>
            Je m’engage à partager les données uniquement au personnel de
            l’organisation que je représente.
          </>
        }
        name="additional_content.partage_agreement"
        value={partage_agreement}
        disabled={disabled}
        onChange={onChange}
      />
      <CheckboxInput
        label={
          <>
            Je m’engage à mettre en œuvre les mesures nécessaires pour éviter la
            divulgation des données à des tiers.
          </>
        }
        name="additional_content.protection_agreement"
        value={protection_agreement}
        disabled={disabled}
        onChange={onChange}
      />
      <CheckboxInput
        label={
          <>
            J’ai compris que les données transmises ne sont pas exhaustives, et
            ne représentent pas l’intégralité des surfaces cultivées en bio —
            les communications publiques et privées doivent en tenir compte et
            l’expliciter.
          </>
        }
        name="additional_content.exhaustivite_agreement"
        value={exhaustivite_agreement}
        disabled={disabled}
        onChange={onChange}
      />
      <CheckboxInput
        label={
          <>
            Je m’engage à tenir l’équipe CartoBio informée des productions
            établies avec les données géographiques — nous les mettrons en
            valeur pour stimuler une variété d’usages.
          </>
        }
        name="additional_content.information_agreement"
        value={information_agreement}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

CguSection.sectionLabel = SECTION_LABEL;

export default CguSection;
