import React from 'react';
import Loader from '../../../atoms/Loader';
import { get, isEmpty } from 'lodash';
import Alert from '../../../atoms/Alert';
import HighVoltageEmoji from '../../../atoms/icons/HighVoltageEmoji';
import Link from '../../../atoms/hyperTexts/Link';
import { Demarche } from '../../../templates/Form/enrollmentReducer';

type DemarcheSectionNotificationProps = {
  isLoading: boolean;
  selectedDemarcheId: string;
  demarches: Record<string, Demarche>;
};

const DemarcheSectionNotification: React.FC<
  DemarcheSectionNotificationProps
> = ({ isLoading = false, selectedDemarcheId, demarches }) => (
  <>
    {isLoading ? (
      <Loader message="pré-remplissage du formulaire en cours ..." />
    ) : (
      <Alert
        title={
          <>
            Formulaire pré-rempli <HighVoltageEmoji />
          </>
        }
      >
        <br />
        Vous avez sélectionné le cas d’usage «{' '}
        <b>{get(demarches, selectedDemarcheId)?.label || selectedDemarcheId}</b>
        {' '}
        ».{' '}
        {!isEmpty(demarches) &&
          selectedDemarcheId &&
          get(demarches, selectedDemarcheId)?.about && (
            <>
              Pour en savoir plus sur ce cas d’usage, vous pouvez en consulter
              la{' '}
              <Link
                inline
                newTab
                aria-label={`Plus d’information sur le cas d’usage « ${selectedDemarcheId} »`}
                href={get(demarches, selectedDemarcheId)?.about}
              >
                fiche explicative
              </Link>
            </>
          )}
        <br />
        <br />
        Certains champs du formulaire ont été pré-remplis afin de faciliter la
        constitution de votre demande d’habilitation. Attention, il est{' '}
        <b>tout de même indispensable</b> que vous lisiez son contenu et que
        vous adaptiez les champs selon votre cas.
      </Alert>
    )}
  </>
);
export default DemarcheSectionNotification;
