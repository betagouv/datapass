import React, { useEffect, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { getUserEnrollment } from '../../../services/enrollments';
import SubmissionPanel from './SubmissionPanel';
import ActivityFeed from './ActivityFeed';
import { ScrollablePanel } from '../../organisms/Scrollable';
import EnrollmentHasCopiesNotification from './EnrollmentHasCopiesNotification';
import PreviousEnrollmentSection from '../../organisms/form-sections/PreviousEnrollmentSection';
import Stepper from '../../organisms/form-sections/PreviousEnrollmentSection/Stepper';
import { DATA_PROVIDER_LABELS } from '../../../config/data-provider-parameters';
import { getStateFromUrlParams, goBack } from '../../../lib';
import Nav from '../../organisms/Nav';
import Tag from '../../atoms/Tag';
import { withUser } from '../../organisms/UserContext';
import FileCopyIcon from '../../atoms/icons/file_copy';
import { Linkify } from '../../molecules/Linkify';
import { enrollmentReducerFactory } from './enrollmentReducer';
import {
  STATUS_TO_BUTTON_TYPE,
  USER_STATUS_LABELS,
} from '../../../config/status-parameters';

export const FormContext = React.createContext();

export const Form = ({
  DemarcheDescription = () => null,
  location,
  steps = undefined,
  target_api,
  enrollmentId = null,
  history,
  demarches = null,
  children,
  documentationUrl,
  contactEmail,
}) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [isUserEnrollmentLoading, setIsUserEnrollmentLoading] = useState(true);
  const sectionLabels = useMemo(() => {
    return React.Children.map(
      children,
      ({ type: { sectionLabel } }) => sectionLabel
    );
  }, [children]);

  const enrollmentReducer = useMemo(
    () => enrollmentReducerFactory(demarches),
    [demarches]
  );

  const [enrollment, dispatchSetEnrollment] = useReducer(enrollmentReducer, {
    acl: {
      update: true,
      submit: true, // Enable edition for new enrollment (ie. enrollment has no id)
    },
    status: 'draft',
    events: [],
    target_api,
    additional_content: {},
  });

  useEffect(() => {
    async function fetchUserEnrollment() {
      try {
        const userEnrollment = await getUserEnrollment(enrollmentId);
        dispatchSetEnrollment(userEnrollment);
        setIsUserEnrollmentLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          history.push('/');
        }
      }
    }

    if (enrollmentId) {
      fetchUserEnrollment();
    } else {
      const { demarche } = getStateFromUrlParams({
        demarche: '',
      });

      if (demarche) {
        // team_members within demarches needs enrollments team_member
        // collection to be initialized first. We wait 500ms to ensure
        // team_members are initialized by ÉquipeSection component.
        setTimeout(
          () =>
            dispatchSetEnrollment({
              target: { name: 'demarche', value: demarche },
            }),
          500
        );
      }
      setIsUserEnrollmentLoading(false);
    }
  }, [enrollmentId, history]);

  useEffect(() => {
    const targetApiLabel = `${DATA_PROVIDER_LABELS[target_api]}`;
    document.title = targetApiLabel;

    if (enrollment.id)
      document.title = `${enrollment.id} - ${
        enrollment.intitule || targetApiLabel
      }`;
  }, [enrollment.id, enrollment.intitule, target_api]);

  useEffect(() => {
    if (enrollment.id && !window.location.pathname.includes(enrollment.id)) {
      history.replace(
        `${window.location.pathname}${
          window.location.pathname.endsWith('/') ? '' : '/'
        }${enrollment.id}`,
        history.state
      );
    }
  }, [enrollment.id, history]);

  const handlePostEvent = ({
    errorMessages = [],
    successMessages = [],
    redirectToHome = false,
  }) => {
    if (redirectToHome) {
      return goBack(history);
    }

    setErrorMessages(errorMessages);
    setSuccessMessages(successMessages);
  };

  return (
    <div className="dashboard">
      <Nav
        target_api={target_api}
        documentationUrl={documentationUrl}
        contactEmail={contactEmail}
        sectionLabels={sectionLabels}
      />
      <div className="main">
        <ScrollablePanel scrollableId="head" className={null}>
          <div
            style={{
              marginBottom: '2em',
            }}
          >
            <>Vous demandez l’accès à</>
            <h1>{DATA_PROVIDER_LABELS[target_api]}</h1>
            <div className="tag-container">
              {enrollment.id && <Tag>Demande n°{enrollment.id}</Tag>}
              {enrollment.copied_from_enrollment_id && (
                <Tag
                  href={`/authorization-request/${enrollment.copied_from_enrollment_id}`}
                  type="info"
                >
                  <FileCopyIcon size={18} color="var(--w)" />
                  <span style={{ marginLeft: '4px' }}>
                    Copie de n°{enrollment.copied_from_enrollment_id}
                  </span>
                </Tag>
              )}
              <Tag type={STATUS_TO_BUTTON_TYPE[enrollment.status]}>
                {USER_STATUS_LABELS[enrollment.status]}
              </Tag>
            </div>
          </div>
          {get(location, 'state.fromFranceConnectedAPI') ===
            'api_droits_cnam' && (
            <>
              <p>La procédure consiste en 2 demandes d’accès distinctes :</p>
              <Stepper
                steps={['franceconnect', 'api_droits_cnam']}
                currentStep="franceconnect"
              />
            </>
          )}
          {get(location, 'state.fromFranceConnectedAPI') ===
            'api_impot_particulier_fc_sandbox' && (
            <>
              <p>La procédure consiste en 3 demandes d’accès distinctes :</p>
              <Stepper
                steps={[
                  'franceconnect',
                  'api_impot_particulier_fc_sandbox',
                  'api_impot_particulier_fc_production',
                ]}
                currentStep="franceconnect"
              />
            </>
          )}
          {steps && (
            <FormContext.Provider
              value={{
                disabled: !enrollment.acl.submit,
                onChange: dispatchSetEnrollment,
                enrollment,
                isUserEnrollmentLoading,
                demarches,
              }}
            >
              <PreviousEnrollmentSection steps={steps} />
            </FormContext.Provider>
          )}
          {get(location, 'state.source') === 'copy-authorization-request' && (
            <div className="notification warning">
              Vous trouverez ci dessous une copie de votre demande initiale.
              Merci de vérifier que ces informations sont à jour puis cliquez
              sur "Soumettre la demande".
            </div>
          )}

          <EnrollmentHasCopiesNotification enrollmentId={enrollment.id} />

          {!isUserEnrollmentLoading && enrollment.acl.update && (
            <>
              <div className="notification info">
                Pensez à enregistrer régulièrement vos modifications.
              </div>
              <DemarcheDescription />
            </>
          )}
        </ScrollablePanel>

        {enrollment.events.length > 0 && (
          <ActivityFeed events={enrollment.events} />
        )}
        <FormContext.Provider
          value={{
            disabled: !enrollment.acl.update,
            onChange: dispatchSetEnrollment,
            enrollment,
            isUserEnrollmentLoading,
            demarches,
          }}
        >
          {children}
        </FormContext.Provider>
        {successMessages.map((successMessage) => (
          <div key={successMessage} className="notification success">
            <Linkify message={successMessage} />
          </div>
        ))}
        {errorMessages.map((errorMessage) => (
          <div
            key={errorMessage}
            className="notification error"
            style={{ whiteSpace: 'pre-line' }}
          >
            <Linkify message={errorMessage} />
          </div>
        ))}

        <SubmissionPanel
          enrollment={enrollment}
          updateEnrollment={dispatchSetEnrollment}
          handlePostEvent={handlePostEvent}
        />
      </div>
    </div>
  );
};

Form.propTypes = {
  title: PropTypes.string,
  DemarcheDescription: PropTypes.func,
  enrollmentId: PropTypes.string,
  target_api: PropTypes.string.isRequired,
  steps: PropTypes.array,
  demarches: PropTypes.any,
  contactEmail: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    location: PropTypes.shape({
      state: PropTypes.shape({
        fromList: PropTypes.bool,
      }),
    }),
  }),
};

export default withRouter(withUser(Form));
