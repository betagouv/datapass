import React, { useContext, useEffect, useState } from 'react';
import { useDataProvider } from '../../../templates/hooks/use-data-provider';
import useAccessToEnrollment from './useAccessToEnrollment';
import { FormContext } from '../../../templates/Form';
import { getUserValidatedEnrollments } from '../../../../services/enrollments';
import { Link as ReactRouterLink } from 'react-router-dom';
import Stepper from '../../../molecules/Stepper';
import SelectInput from '../../../atoms/inputs/SelectInput';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import { isEmpty } from 'lodash';
import { ScrollablePanel } from '../../Scrollable';
import Alert from '../../../atoms/Alert';
import Link from '../../../atoms/hyperTexts/Link';

const SECTION_LABEL = 'Habilitation associée';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const PreviousEnrollmentSection = ({ steps }) => {
  const {
    isUserEnrollmentLoading,
    disabled,
    onChange,
    enrollment: { previous_enrollment_id = '', target_api },
  } = useContext(FormContext);

  // disable fetch if not disabled or is loading
  const hasAccessToPreviousEnrollment = useAccessToEnrollment(
    disabled && !isUserEnrollmentLoading && previous_enrollment_id
  );

  const [validatedEnrollments, setValidatedEnrollments] = useState([]);
  const [isValidatedEnrollmentsLoading, setIsValidatedEnrollmentsLoading] =
    useState(false);
  const [validatedEnrollmentsError, setValidatedEnrollmentsError] =
    useState(false);
  const [previousTargetApi, setPreviousTargetApi] = useState();

  const { label: targetApiLabel } = useDataProvider(target_api);
  const { label: previousTargetApiLabel } = useDataProvider(previousTargetApi);

  useEffect(() => {
    setPreviousTargetApi(
      steps[steps.findIndex((e) => e === target_api) - 1] || null
    );
  }, [steps, target_api]);

  useEffect(() => {
    const fetchUserValidatedEnrollments = async () => {
      try {
        setIsValidatedEnrollmentsLoading(true);
        setValidatedEnrollmentsError(false);
        const enrollments = await getUserValidatedEnrollments(
          previousTargetApi
        );
        setValidatedEnrollments(enrollments);
        setIsValidatedEnrollmentsLoading(false);
      } catch (e) {
        setValidatedEnrollmentsError(true);
        setIsValidatedEnrollmentsLoading(false);
      }
    };

    if (!disabled && !isUserEnrollmentLoading && previousTargetApi) {
      fetchUserValidatedEnrollments();
    }
  }, [isUserEnrollmentLoading, disabled, previousTargetApi]);

  useEffect(() => {
    if (!isEmpty(validatedEnrollments) && !previous_enrollment_id) {
      onChange({
        target: {
          name: 'previous_enrollment_id',
          value: validatedEnrollments[0].id,
        },
      });
    }
  }, [validatedEnrollments, previous_enrollment_id, onChange]);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Habilitation {previousTargetApiLabel} associée</h2>
      {!disabled && !isUserEnrollmentLoading && (
        <>
          <p>
            La procédure consiste en {steps.length} demandes d’habilitation
            distinctes :
          </p>
          <Stepper
            steps={steps}
            currentStep={!isValidatedEnrollmentsLoading && target_api}
            previousStepNotCompleted={
              !isValidatedEnrollmentsLoading &&
              previousTargetApi &&
              validatedEnrollments.length === 0
            }
          />
        </>
      )}
      {!disabled &&
        !isUserEnrollmentLoading &&
        !isValidatedEnrollmentsLoading &&
        previousTargetApi &&
        validatedEnrollments.length === 0 && (
          <Alert type="warning">
            <p>
              Pour demander l’accès à <b>{targetApiLabel}</b>, vous devez avoir
              préalablement obtenu une habilitation à{' '}
              <b>{previousTargetApiLabel}</b>.
            </p>
            <p>
              Veuillez{' '}
              <ReactRouterLink
                to={{
                  pathname: `/${previousTargetApi.replace(/_/g, '-')}`,
                  state: { fromFranceConnectedAPI: target_api },
                }}
              >
                demander votre habilitation à <b>{previousTargetApiLabel}</b>
              </ReactRouterLink>{' '}
              avant de continuer cette demande d’habilitation.
            </p>
            {previousTargetApi === 'franceconnect' && (
              <p>
                Vous avez déjà accès à FranceConnect mais vous ne retrouvez pas
                l’habilitation correspondante ? Vos accès datent probablement
                d’avant la mise en place de ce dispositif. Merci de remplir une
                nouvelle demande d’habilitation FranceConnect. Cette nouvelle
                habilitation n’interférera pas avec vos accès précédents.
              </p>
            )}
          </Alert>
        )}
      {previousTargetApi && (
        <div className="fr-m-3w">
          {previousTargetApi === 'franceconnect' && (
            <ExpandableQuote title="Pourquoi associer une habilitation FranceConnect ?">
              <>
                <p>
                  Lorsque cette demande d’habilitation à {targetApiLabel} sera
                  validée vous disposerez des périmètres de données
                  supplémentaires demandés.
                </p>
                <p>Ils apparaitront à l’utilisateur lors de sa connexion.</p>
              </>
            </ExpandableQuote>
          )}
          {!disabled &&
            !isUserEnrollmentLoading &&
            isValidatedEnrollmentsLoading && (
              <>
                <h4>
                  Association à votre habilitation{' '}
                  <b>{previousTargetApiLabel}</b>
                </h4>
                <p>
                  Chargement de vos habilitations{' '}
                  <b>{previousTargetApiLabel}</b>
                  ...
                </p>
              </>
            )}
          {!disabled &&
            !isUserEnrollmentLoading &&
            validatedEnrollmentsError && (
              <Alert title="Erreur" type="error">
                Erreur inconnue lors de la récupération de vos habilitations{' '}
                {previousTargetApiLabel}.
              </Alert>
            )}
          {!disabled &&
            !isUserEnrollmentLoading &&
            !isValidatedEnrollmentsLoading && (
              <>
                <SelectInput
                  label={
                    <>
                      Nom de l’habilitation <b>{previousTargetApiLabel}</b>{' '}
                      {previousTargetApi === 'franceconnect' ? (
                        <>à associer</>
                      ) : (
                        <>que vous souhaitez poursuivre</>
                      )}
                    </>
                  }
                  name="previous_enrollment_id"
                  options={[
                    ...validatedEnrollments.map(({ intitule: name, id }) => ({
                      id,
                      label: `n°${id} : ${name}`,
                    })),
                  ]}
                  value={previous_enrollment_id}
                  disabled={disabled}
                  onChange={onChange}
                />
              </>
            )}
          {disabled && !isUserEnrollmentLoading && (
            <>
              {hasAccessToPreviousEnrollment ? (
                <Link
                  inline
                  href={`/${previousTargetApi.replace(
                    /_/g,
                    '-'
                  )}/${previous_enrollment_id}`}
                >
                  Numéro de l’habilitation associée : {previous_enrollment_id}
                </Link>
              ) : (
                <>
                  Numéro de l’habilitation associée : {previous_enrollment_id}
                </>
              )}
            </>
          )}
        </div>
      )}
    </ScrollablePanel>
  );
};

PreviousEnrollmentSection.sectionLabel = SECTION_LABEL;

export default PreviousEnrollmentSection;
