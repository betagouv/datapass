import React, { useEffect, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { get, isObject, omitBy, merge, set } from 'lodash';
import Linkify from 'linkifyjs/react';

import { getUserEnrollment } from '../../../services/enrollments';
import SubmissionPanel from './SubmissionPanel';
import ActivityFeed from './ActivityFeed';
import { ScrollablePanel } from '../../organisms/Scrollable';
import EnrollmentHasCopiesNotification from './EnrollmentHasCopiesNotification';
import PreviousEnrollmentSection from '../../organisms/form-sections/PreviousEnrollmentSection';
import Stepper from '../../organisms/form-sections/PreviousEnrollmentSection/Stepper';
import { TARGET_API_LABELS } from '../../../lib/api';
import { getStateFromUrlParams, goBack } from '../../../lib';
import Nav from '../../organisms/Nav';
import { USER_STATUS_LABELS } from '../../../lib/enrollment';
import Tag from '../../atoms/Tag';
import statusToButtonType from '../../../lib/status-to-button-type';
import { withUser } from '../../organisms/UserContext';

export const FormContext = React.createContext();

const enrollmentReducer =
  (demarches = null) =>
  (previousEnrollment, action) => {
    if (!isObject(action)) {
      return previousEnrollment;
    }

    // if no action.target, this is a direct state update (network for instance)
    // a direct state update DOES NOT trigger a pre-filled demarche update
    if (!action.target) {
      const newEnrollment = action;

      return merge(
        {},
        previousEnrollment,
        omitBy(newEnrollment, (e) => e === null) // do not merge null properties, keep empty string instead to avoid controlled input to switch to uncontrolled input
      );
    }

    // if action.target, it means reducer was trigger by an html element (input, select etc.)
    const {
      target: { type = null, checked = null, value: inputValue, name },
    } = action;

    // checkbox elements must be handled specifically as we look for checked and not target
    const value = type === 'checkbox' ? checked : inputValue;

    let futureEnrollment = { ...previousEnrollment };
    set(futureEnrollment, name, value);

    if (demarches && name === 'demarche') {
      futureEnrollment = merge(
        {},
        futureEnrollment,
        get(demarches, 'default', {}).state,
        get(demarches, value, {}).state
      );
    }

    return futureEnrollment;
  };

export const Form = ({
  title,
  DemarcheDescription = () => null,
  location,
  steps = undefined,
  PreviousEnrollmentDescription,
  target_api,
  enrollmentId = null,
  history,
  user,
  demarches = null,
  children,
  documentationUrl,
  contactInformation,
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

  const [enrollment, dispatchSetEnrollment] = useReducer(
    enrollmentReducer(demarches),
    {
      acl: {
        update: true,
        send_application: true, // Enable edition for new enrollment (ie. enrollment has no id)
      },
      status: 'pending',
      events: [],
      target_api,
      additional_content: {},
    }
  );

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
        dispatchSetEnrollment({
          target: { name: 'demarche', value: demarche },
        });
      }
      setIsUserEnrollmentLoading(false);
    }
  }, [enrollmentId, history]);

  useEffect(() => {
    const targetApiLabel = `${TARGET_API_LABELS[target_api]}`;
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

  const handleSubmit = ({
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
        contactInformation={contactInformation}
        sectionLabels={sectionLabels}
      />
      <div className="main">
        <ScrollablePanel scrollableId="head" className={null}>
          <div
            style={{
              marginBottom: '2em',
            }}
          >
            {title ? (
              <h1>{title}</h1>
            ) : (
              <>
                <>Vous demandez l’accès à</>
                <h1>{title || TARGET_API_LABELS[target_api]}</h1>
              </>
            )}
            {enrollment.id && <Tag>Demande n°{enrollment.id}</Tag>}
            <Tag type={statusToButtonType[enrollment.status]}>
              {USER_STATUS_LABELS[enrollment.status]}
            </Tag>
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
                disabled: !enrollment.acl.send_application,
                onChange: dispatchSetEnrollment,
                enrollment,
                isUserEnrollmentLoading,
                demarches,
              }}
            >
              <PreviousEnrollmentSection
                steps={steps}
                Description={PreviousEnrollmentDescription}
              />
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
                Pensez à sauvegarder régulièrement votre demande en brouillon.
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
            disabled: !enrollment.acl.send_application,
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
            <Linkify>{successMessage}</Linkify>
          </div>
        ))}
        {errorMessages.map((errorMessage) => (
          <div
            key={errorMessage}
            className="notification error"
            style={{ whiteSpace: 'pre-line' }}
          >
            <Linkify>{errorMessage}</Linkify>
          </div>
        ))}

        <SubmissionPanel
          enrollment={enrollment}
          updateEnrollment={dispatchSetEnrollment}
          handleSubmit={handleSubmit}
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
  contactInformation: PropTypes.array,
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
