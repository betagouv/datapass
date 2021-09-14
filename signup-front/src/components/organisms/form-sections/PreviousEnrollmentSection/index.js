import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { TARGET_API_LABELS } from '../../../../lib/api';
import useAccessToEnrollment from './useAccessToEnrollment';
import { FormContext } from '../../../templates/Form';
import { getUserValidatedEnrollments } from '../../../../services/enrollments';
import { Link } from 'react-router-dom';
import Stepper from './Stepper';
import Quote from '../../../atoms/inputs/Quote';
import Select from '../../../atoms/inputs/Select';

const PreviousEnrollmentSection = ({
  steps,
  Description = () => (
    <Quote>
      <p>
        Afin de pouvoir utiliser votre bouton FranceConnect pour récupérer les
        données, merci de renseigner la demande FranceConnect à associer à cette
        demande.
      </p>
    </Quote>
  ),
}) => {
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
  const [previousTargetApi, setPreviousTargetApi] = useState(null);

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

  return (
    <>
      {!disabled && !isUserEnrollmentLoading && (
        <>
          <p>
            La procédure consiste en {steps.length} demandes d’accès
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
          <div className="form__group">
            <div className="notification warning">
              <p>
                Pour demander l’accès à <b>{TARGET_API_LABELS[target_api]}</b>
                {target_api === 'api_impot_particulier_fc_sandbox' && (
                  <span> en mode FranceConnecté</span>
                )}
                , vous devez avoir préalablement obtenu un accès à{' '}
                <b>{TARGET_API_LABELS[previousTargetApi]}</b>.
              </p>
              <p>
                Veuillez{' '}
                <Link
                  to={{
                    pathname: `/${previousTargetApi.replace(/_/g, '-')}`,
                    state: { fromFranceConnectedAPI: target_api },
                  }}
                >
                  demander votre accès à{' '}
                  <b>{TARGET_API_LABELS[previousTargetApi]}</b>
                </Link>{' '}
                avant de continuer cette demande.
              </p>
              {previousTargetApi === 'franceconnect' && (
                <p>
                  Vous avez déjà accès à FranceConnect mais vous ne retrouvez
                  pas la demande correspondante ? Vos accès datent probablement
                  d’avant la mise en place de ce dispositif. Merci de remplir
                  une nouvelle demande d’accès à FranceConnect. Cette nouvelle
                  demande n’interférera pas avec vos accès précédents.
                </p>
              )}
            </div>
          </div>
        )}
      {previousTargetApi && (
        <div className="panel">
          <h2>Démarche {TARGET_API_LABELS[previousTargetApi]} associée</h2>
          <Description />
          {!disabled &&
            !isUserEnrollmentLoading &&
            isValidatedEnrollmentsLoading && (
              <div className="form__group">
                <h4>
                  Association à votre demande{' '}
                  <b>{TARGET_API_LABELS[previousTargetApi]}</b>
                </h4>
                <p>
                  Chargement de vos demandes{' '}
                  <b>{TARGET_API_LABELS[previousTargetApi]}</b>
                  ...
                </p>
              </div>
            )}
          {!disabled && !isUserEnrollmentLoading && validatedEnrollmentsError && (
            <div className="form__group">
              <div className="notification error">
                Erreur inconnue lors de la récupération de vos demandes{' '}
                {TARGET_API_LABELS[previousTargetApi]}.
              </div>
            </div>
          )}
          {!disabled &&
            !isUserEnrollmentLoading &&
            !isValidatedEnrollmentsLoading && (
              <>
                <Select
                  label={
                    <>
                      Nom de la démarche{' '}
                      <b>{TARGET_API_LABELS[previousTargetApi]}</b>
                    </>
                  }
                  helper={
                    target_api === 'api_impot_particulier_fc_sandbox' &&
                    'Sélectionnez "aucune démarche" si vous souhaitez accéder à l’API sans FranceConnect'
                  }
                  name="previous_enrollment_id"
                  options={[
                    { id: '', label: 'aucune démarche' },
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
                <a
                  href={`/${previousTargetApi.replace(
                    /_/g,
                    '-'
                  )}/${previous_enrollment_id}`}
                >
                  Numéro de la demande associée : {previous_enrollment_id}
                </a>
              ) : (
                <>Numéro de la demande associée : {previous_enrollment_id}</>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

PreviousEnrollmentSection.propTypes = {
  previousTargetApi: PropTypes.string,
  Description: PropTypes.func,
};

export default PreviousEnrollmentSection;
