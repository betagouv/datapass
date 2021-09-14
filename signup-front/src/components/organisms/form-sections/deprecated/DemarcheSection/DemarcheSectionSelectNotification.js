import React from 'react';
import Loader from '../../../../atoms/Loader';
import { get, has, isEmpty } from 'lodash';

const DemarcheSectionNotification = ({
  isLoading = false,
  selectedDemarcheId,
  demarches,
}) => {
  const displayNotification =
    has(demarches, selectedDemarcheId) && selectedDemarcheId !== 'default';

  return (
    <>
      {displayNotification && (
        <div className="notification info">
          {isLoading ? (
            <Loader message="pré-remplissage du formulaire en cours ..." />
          ) : (
            <div>
              <b>
                Formulaire pré-rempli{' '}
                <span role="img" aria-label="Emoji-eclair">
                  ⚡️
                </span>
              </b>
              <br />
              Vous avez séléctionné le cas d’usage «{' '}
              <b>
                {get(demarches, selectedDemarcheId, {}).label ||
                  selectedDemarcheId}
              </b>{' '}
              ».{' '}
              {!isEmpty(demarches) &&
                selectedDemarcheId &&
                get(demarches, selectedDemarcheId, {}).about && (
                  <>
                    Pour en savoir plus sur ce cas d’usage, vous pouvez en
                    consulter la{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Plus d’information sur le cas d’usage « ${selectedDemarcheId} »`}
                      href={get(demarches, selectedDemarcheId, {}).about}
                    >
                      fiche explicative
                    </a>
                  </>
                )}
              <br />
              <br />
              Certains champs du formulaire ont été pré-remplis afin de
              faciliter votre demande. Attention, il est{' '}
              <b>tout de même indispensable</b> que vous lisiez la demande et
              que vous adaptiez les champs selon votre cas.
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default DemarcheSectionNotification;
