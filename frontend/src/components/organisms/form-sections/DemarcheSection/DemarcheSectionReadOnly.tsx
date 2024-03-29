import React, { useContext, useEffect, useState } from 'react';
import { find, get, has, isEmpty, merge } from 'lodash';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import { useAuth } from '../../AuthContext';
import { findModifiedFields, findModifiedScopes } from '../../../../lib';
import './DemarcheSectionReadOnly.css';
import WarningEmoji from '../../../atoms/icons/WarningEmoji';
import { ScopeConfiguration } from '../DonneesSection/Scopes';
import { Demarche } from '../../../../config';

const valueToLabel = (
  key: string,
  scopesConfiguration?: ScopeConfiguration[]
) => {
  const scope = find(scopesConfiguration, { value: key });
  if (scope) {
    return scope.label;
  } else {
    return key;
  }
};

type DemarcheSectionReadOnlyProps = {
  scrollableId: string;
  scopesConfiguration?: ScopeConfiguration[];
};

export const DemarcheSectionReadOnly: React.FC<
  DemarcheSectionReadOnlyProps
> = ({ scrollableId, scopesConfiguration }) => {
  const { enrollment, demarches } = useContext(FormContext)!;

  const { demarche: selectedDemarcheId } = enrollment;
  const { user } = useAuth();

  const [modifiedFields, setModifiedFields] = useState<any[]>([]);
  const [modifiedScopes, setModifiedScopes] = useState({});

  useEffect(() => {
    if (
      demarches &&
      demarches[selectedDemarcheId] &&
      demarches[selectedDemarcheId].state &&
      enrollment
    ) {
      const demarcheState = merge(
        {},
        get(demarches, 'default', {} as Demarche).state,
        get(demarches, selectedDemarcheId, {} as Demarche).state
      );
      setModifiedFields(findModifiedFields(demarcheState, enrollment));
      setModifiedScopes(findModifiedScopes(demarcheState, enrollment));
    }
  }, [enrollment, selectedDemarcheId, demarches]);

  const hasSelectedDemarche =
    has(demarches, selectedDemarcheId) && selectedDemarcheId !== 'default';

  return (
    <>
      <ScrollablePanel scrollableId={scrollableId}>
        <h2>Les modèles pré-remplis</h2>
        <div>
          {hasSelectedDemarche ? (
            <>
              <p>
                Ce formulaire a été pré-rempli selon le cas d’usage suivant :{' '}
                <i>
                  {get(demarches, selectedDemarcheId, {} as Demarche).label ||
                    selectedDemarcheId}
                </i>
              </p>
              {!isEmpty(user?.roles) && !isEmpty(modifiedFields) && (
                <p>
                  Certaines des sections pré-remplies par le cas d’usage ont été
                  modifiées.
                </p>
              )}
              {!isEmpty(modifiedScopes) && (
                <>
                  <p>
                    Les périmètres de données suivants ont notamment été
                    modifiés par rapport au modèle pré-rempli :
                  </p>
                  <ul>
                    {Object.entries(modifiedScopes).map(([key, value]) => (
                      <li key={key}>
                        <strong>
                          {valueToLabel(key, scopesConfiguration)} :
                        </strong>
                        {value ? (
                          <span className="text--red">
                            {' '}
                            <WarningEmoji /> Nouvelle donnée demandée
                          </span>
                        ) : (
                          <span className="text--green"> Donnée décochée</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <>
              Cette habilitation n’a pas utilisé de modèle de pré-remplissage.
            </>
          )}
        </div>
      </ScrollablePanel>
    </>
  );
};

export default DemarcheSectionReadOnly;
