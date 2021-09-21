import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isEmpty, merge, get, has } from 'lodash';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import ConfirmationModal from '../../ConfirmationModal';
import { findModifiedFields } from '../../../../lib';
import DemarcheSectionSelectNotification from './DemarcheSectionSelectNotification';
import SelectInput from '../../../atoms/inputs/SelectInput';

export const DemarcheSectionSelect = ({ body, scrollableId }) => {
  const { disabled, onChange, enrollment, demarches } = useContext(FormContext);
  const { demarche: selectedDemarcheId } = enrollment;

  const [isLoading, setIsLoading] = useState(false);
  const [confirmNewDemarcheId, setConfirmNewDemarcheId] = useState(false);

  // reducer expects onChange events from HTML Element
  const selectNewDemarche = useCallback(
    (newDemarcheId) => {
      onChange({ target: { value: newDemarcheId, name: 'demarche' } });
    },
    [onChange]
  );

  const onSelectDemarche = (event) => {
    let newDemarcheId = event.target.value || 'default';

    const preFilledEnrollment = merge(
      {},
      get(demarches, 'default', {}).state,
      get(demarches, selectedDemarcheId, {}).state
    );

    // we compare current enrollment with prefilled associated with selectedDemarcheId
    // if modifications, it means any change to selectedDemarcheId could overwrite the user's changes.
    const modifications = findModifiedFields(preFilledEnrollment, enrollment);

    if (!isEmpty(modifications)) {
      // trigger confirmation modal before updating Enrollment
      setConfirmNewDemarcheId(newDemarcheId);
    } else {
      // update Enrollment Context with new demarche
      selectNewDemarche(newDemarcheId);
    }
  };

  useEffect(() => {
    if (selectedDemarcheId !== 'default') {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 900);
      return () => clearTimeout(timer);
    }
  }, [selectedDemarcheId]);

  const displayNotification = useMemo(
    () =>
      has(demarches, selectedDemarcheId) && selectedDemarcheId !== 'default',
    [demarches, selectedDemarcheId]
  );

  return (
    <>
      <ScrollablePanel scrollableId={scrollableId}>
        <h2>Les modèles pré-remplis</h2>
        {body || (
          <p>
            Nous avons identifié plusieurs cas d’usage de cette API. Si votre
            demande s’inscrit dans un des cas ci-dessous, sélectionnez-le pour
            gagner du temps.
          </p>
        )}
        <SelectInput
          label="Sélectionnez le modèle correspondant à votre projet"
          name="demarche"
          options={Object.keys(demarches).map((demarcheId) => ({
            id: demarcheId,
            label: get(demarches, demarcheId, {}).label,
          }))}
          value={selectedDemarcheId}
          disabled={disabled}
          onChange={onSelectDemarche}
        />
        {confirmNewDemarcheId && (
          <ConfirmationModal
            title="Attention, vous allez écraser certains de vos changements"
            handleCancel={() => setConfirmNewDemarcheId(false)}
            handleConfirm={() => {
              setConfirmNewDemarcheId(false);
              selectNewDemarche(confirmNewDemarcheId);
            }}
            confirmLabel="Changer tout de même"
          >
            <p>
              En changeant de cas d’usage, certains des champs que vous avez
              édités vont être écrasés.
            </p>
          </ConfirmationModal>
        )}
        {displayNotification && (
          <DemarcheSectionSelectNotification
            isLoading={isLoading}
            selectedDemarcheId={selectedDemarcheId}
            demarches={demarches}
          />
        )}
      </ScrollablePanel>
    </>
  );
};

export default DemarcheSectionSelect;
