import { isEmpty } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DATA_PROVIDER_PARAMETERS } from '../../../config/data-provider-parameters';
import { getStateFromUrlParams } from '../../../lib';
import { getUserEnrollment } from '../../../services/enrollments';
import Alert from '../../atoms/Alert';
import WarningEmoji from '../../atoms/icons/WarningEmoji';
import { Linkify } from '../../molecules/Linkify';
import HeadSection from '../../organisms/form-sections/HeadSection';
import StepperSection from '../../organisms/form-sections/StepperSection';
import Nav from '../../organisms/Nav';
import NotFound from '../../organisms/NotFound';
import useListItemNavigation from '../hooks/use-list-item-navigation';
import { enrollmentReducerFactory } from './enrollmentReducer';
import HideSectionsContainer from './HideSectionsContainer';
import './style.css';
import SubmissionPanel from './SubmissionPanel';

export const FormContext = React.createContext();

export const Form = ({
  target_api,
  demarches = null,
  children,
  documentationUrl,
  contactEmail,
}) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [isUserEnrollmentLoading, setIsUserEnrollmentLoading] = useState(true);
  const { enrollmentId } = useParams();
  const [hasNotFoundError, setHasNotFoundError] = useState(false);
  const navigate = useNavigate();
  const { goBackToList } = useListItemNavigation();

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
        if ([403, 404].includes(error.response?.status)) {
          setHasNotFoundError(true);
          setTimeout(() => goBackToList(), 3000);
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
  }, [enrollmentId, goBackToList]);

  useEffect(() => {
    const targetApiLabel = `${DATA_PROVIDER_PARAMETERS[target_api]?.label}`;

    if (targetApiLabel) {
      document.title = targetApiLabel;
    }

    if (enrollment.id) {
      document.title = `${enrollment.id} - ${
        enrollment.intitule || targetApiLabel
      }`;
    }
  }, [enrollment.id, enrollment.intitule, target_api]);

  useEffect(() => {
    if (enrollment.id && !window.location.pathname.includes(enrollment.id)) {
      navigate(`${enrollment.id}`, {
        replace: true,
        state: { noScroll: true },
      });
    }
  }, [enrollment.id, navigate]);

  const handlePostEvent = useCallback(
    ({ errorMessages = [], successMessages = [], redirectToHome = false }) => {
      if (redirectToHome) {
        return goBackToList();
      }

      setErrorMessages(errorMessages);
      setSuccessMessages(successMessages);
    },
    [goBackToList]
  );

  if (hasNotFoundError) {
    return <NotFound />;
  }

  return (
    <main className="dashboard-page">
      <Nav
        target_api={target_api}
        documentationUrl={documentationUrl}
        contactEmail={contactEmail}
        sectionLabels={sectionLabels}
      />
      <div className="form-container">
        <FormContext.Provider
          value={{
            disabled: !enrollment.acl.submit,
            onChange: dispatchSetEnrollment,
            enrollment,
            isUserEnrollmentLoading,
            demarches,
          }}
        >
          <HeadSection />
          <StepperSection />
          <HideSectionsContainer>
            {children}
            <SubmissionPanel
              enrollment={enrollment}
              handlePostEvent={handlePostEvent}
              updateEnrollment={dispatchSetEnrollment}
            />
          </HideSectionsContainer>
        </FormContext.Provider>

        {(!isEmpty(errorMessages) || !isEmpty(successMessages)) && (
          <div>
            {successMessages.map((successMessage) => (
              <Alert type="success" key={successMessage}>
                <Linkify message={successMessage} />
              </Alert>
            ))}
            {!isEmpty(errorMessages) && (
              <Alert title="Erreur" type="error">
                {errorMessages.map((errorMessage) => (
                  <p key={errorMessage} style={{ whiteSpace: 'pre-line' }}>
                    <WarningEmoji />
                    {' '}
                    <Linkify message={errorMessage} />
                  </p>
                ))}
              </Alert>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Form;
