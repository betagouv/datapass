import React, { useContext, useMemo } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import { isEmpty } from 'lodash';
import useGetSubscribedDemarcheEnLigne from './useGetSubscribedDemarcheEnLigne';
import WarningEmoji from '../../../atoms/icons/WarningEmoji';

const SECTION_LABEL = 'Démarches en ligne';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

type DemarcheEnLigneSectionProps = {
  demarchesHubee: {
    id: string;
    label: string;
    description: any;
  }[];
};

interface DemarcheEnLigneSectionType
  extends React.FC<DemarcheEnLigneSectionProps> {
  sectionLabel: string;
}

export const DemarcheEnLigneSection: DemarcheEnLigneSectionType = ({
  demarchesHubee = [],
}) => {
  const {
    disabled,
    onChange,
    isUserEnrollmentLoading,
    enrollment: { scopes = {}, siret = '' },
  } = useContext(FormContext)!;

  const subscribedDemarcheEnLigne = useGetSubscribedDemarcheEnLigne({
    isUserEnrollmentLoading,
    siret,
  });

  const showAlreadySubscribedWarning = useMemo(
    () =>
      demarchesHubee
        .map(({ id }) => id)
        .some((id) => subscribedDemarcheEnLigne.includes(id)),
    [demarchesHubee, subscribedDemarcheEnLigne]
  );

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>
        Démarches en ligne auxquelles vous souhaitez abonner votre commune
      </h2>
      <ExpandableQuote
        title={`En quoi ${
          demarchesHubee.length === 1
            ? 'consiste cette démarche'
            : 'consistent ces démarches'
        } ?`}
      >
        <>
          {!isEmpty(demarchesHubee) &&
            !disabled &&
            showAlreadySubscribedWarning && (
              <p>
                <WarningEmoji /> Votre commune dispose déjà d’un abonnement à
                une ou plusieurs démarches. Si vous n’y avez pas accès ou si
                vous rencontrez un problème, merci de contacter le référent
                HubEE de votre commune. Vous pouvez également nous contacter en
                cliquant sur le bouton « Nous contacter » dans le menu latéral.
              </p>
            )}
          {!isEmpty(demarchesHubee) &&
            demarchesHubee.map(({ id, label, description }) => (
              <p key={id}>
                <b>{label} :</b> {description}
              </p>
            ))}
        </>
      </ExpandableQuote>
      {!isEmpty(demarchesHubee) &&
        demarchesHubee.map(({ id, label }) => (
          <CheckboxInput
            name={`scopes.${id}`}
            key={id}
            value={scopes[id]}
            label={`${label}${
              !disabled && subscribedDemarcheEnLigne.includes(id)
                ? ' (votre commune est déjà abonnée à cette démarche)'
                : ''
            }`}
            onChange={onChange}
            disabled={disabled || subscribedDemarcheEnLigne.includes(id)}
          />
        ))}
    </ScrollablePanel>
  );
};

DemarcheEnLigneSection.sectionLabel = SECTION_LABEL;

export default DemarcheEnLigneSection;
