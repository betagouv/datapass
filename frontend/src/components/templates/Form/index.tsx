import { isEmpty, last } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
  JSXElementConstructor,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStateFromUrlParams } from '../../../lib';
import { getUserEnrollment } from '../../../services/enrollments';
import Alert, { AlertType } from '../../atoms/Alert';
import WarningEmoji from '../../atoms/icons/WarningEmoji';
import { Linkify } from '../../molecules/Linkify';
import HeadSection from '../../organisms/form-sections/HeadSection';
import StepperSection from '../../organisms/form-sections/StepperSection';
import Nav from '../../organisms/Nav';
import NotFound from '../../organisms/NotFound';
import { useDataProvider } from '../hooks/use-data-provider';
import useListItemNavigation from '../hooks/use-list-item-navigation';
import { enrollmentReducerFactory } from './enrollmentReducer';
import HideSectionsContainer from './HideSectionsContainer';
import OpenMessagePromptContextProvider from './OpenMessagePromptContextProvider';
import './style.css';
import StickyActions from '../../molecules/StickyActions';
import SubmissionPanel from './SubmissionPanel';
import { AxiosError } from 'axios';
import { EnrollmentStatus } from '../../../config/status-parameters';
import { Demarches, Enrollment } from '../../../config';
import ConfirmationModal from '../../organisms/ConfirmationModal';
import { useAuth } from '../../organisms/AuthContext';

type FormContextType = {
  disabled: boolean;
  onChange: (value: any) => void;
  enrollment: Enrollment;
  isUserEnrollmentLoading: boolean;
  demarches: Demarches | null;
};

export const FormContext = React.createContext<FormContextType | undefined>(
  undefined
);

type ChildWithSectionLabel = {
  type: {
    sectionLabel?: string;
  } & (string | JSXElementConstructor<any>);
};

type FormProps = {
  target_api: string;
  demarches?: any;
  children:
    | React.ReactElement<ChildWithSectionLabel>[]
    | React.ReactElement<ChildWithSectionLabel>;
  documentationUrl?: string;
  contactEmail?: string | null;
};

export const Form: React.FC<FormProps> = ({
  target_api,
  demarches = null,
  children,
  documentationUrl,
  contactEmail,
}) => {
  const [demandeurPhoneNumberWarning, setDemandeurPhoneNumberWarning] =
    useState(false);
  const [hasCheckedPhoneNumber, setHasCheckedPhoneNumber] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);
  const [isUserEnrollmentLoading, setIsUserEnrollmentLoading] = useState(true);
  const { enrollmentId } = useParams();
  const [hasNotFoundError, setHasNotFoundError] = useState(false);
  const navigate = useNavigate();
  const { goBackToList } = useListItemNavigation();
  const alertRef: React.RefObject<HTMLDivElement> = useRef(null);
  const { user } = useAuth();

  const sectionLabels = useMemo(() => {
    return React.Children.toArray(children)
      .map((child) => {
        if (
          React.isValidElement(child) &&
          typeof child.type !== 'string' &&
          'sectionLabel' in child.type &&
          typeof child.type.sectionLabel === 'string'
        ) {
          return child.type.sectionLabel;
        }
        return null;
      })
      .filter((label): label is string => typeof label === 'string');
  }, [children]);

  type Action = Enrollment | Event | string;

  const enrollmentReducer = useMemo(
    () => enrollmentReducerFactory(demarches),
    [demarches]
  ) as (state: Enrollment, action: Action) => Enrollment;

  const [enrollment, dispatchSetEnrollment] = useReducer<
    (state: Enrollment, action: Enrollment | Event | string) => Enrollment
  >(enrollmentReducer, {
    acl: {
      update: true,
      submit: true,
    },
    status: EnrollmentStatus.draft,
    events: [],
    target_api,
    additional_content: {},
  } as unknown as Enrollment);

  const { label } = useDataProvider(target_api);

  useEffect(() => {
    async function fetchUserEnrollment() {
      try {
        const userEnrollment = await getUserEnrollment(Number(enrollmentId));
        dispatchSetEnrollment(userEnrollment);
        setIsUserEnrollmentLoading(false);
      } catch (error) {
        const axiosError = error as AxiosError;
        if ([403, 404].includes(axiosError?.response!.status)) {
          setHasNotFoundError(true);
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
            } as unknown as Event),
          500
        );
      }
      setIsUserEnrollmentLoading(false);
    }
  }, [enrollmentId, goBackToList]);

  useEffect(() => {
    if (label) {
      document.title = label;
    }

    if (enrollment.id) {
      document.title = `${enrollment.id} - ${enrollment.intitule || label}`;
    }
  }, [enrollment.id, enrollment.intitule, label]);

  useEffect(() => {
    if (
      enrollment.id &&
      !window.location.pathname.includes(enrollment.id.toString())
    ) {
      navigate(`${enrollment.id}`, {
        replace: true,
        state: { noScroll: true },
      });
    }
  }, [enrollment.id, navigate]);

  const handlePostEvent = useCallback(
    ({ errorMessages = [], successMessages = [], redirectToHome = false }) => {
      if (redirectToHome) {
        return goBackToList(last(successMessages));
      }

      setErrorMessages(errorMessages);
      setSuccessMessages(successMessages);
    },
    [goBackToList]
  );

  useEffect(() => {
    if (!isEmpty(successMessages) || !isEmpty(errorMessages)) {
      if (alertRef.current) {
        alertRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [successMessages, errorMessages, alertRef]);

  // Display a warning popup if the demandeur does not have a phone number 📞
  useEffect(() => {
    if (hasCheckedPhoneNumber) return;

    if (!isEmpty(enrollment.team_members) && !!user) {
      const firstDemandeur = enrollment.team_members?.find(
        ({ type }) => type === 'demandeur'
      );
      const isUserFirstDemandeur = user.email === firstDemandeur?.email;

      if (isUserFirstDemandeur) {
        if (!firstDemandeur?.phone_number) {
          setDemandeurPhoneNumberWarning(true);
        } else {
          setDemandeurPhoneNumberWarning(false);
        }
        setHasCheckedPhoneNumber(true);
      }
    }
  }, [enrollment.team_members, user, hasCheckedPhoneNumber]);

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
        <OpenMessagePromptContextProvider>
          <FormContext.Provider
            value={{
              disabled: !enrollment?.acl?.submit,
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
              <StickyActions
                enrollment={enrollment}
                handlePostEvent={handlePostEvent}
                updateEnrollment={dispatchSetEnrollment}
              />
            </HideSectionsContainer>
          </FormContext.Provider>
        </OpenMessagePromptContextProvider>

        {demandeurPhoneNumberWarning && (
          <ConfirmationModal
            handleCancel={() => setDemandeurPhoneNumberWarning(false)}
            handleConfirm={() =>
              window.open(
                'https://app.moncomptepro.beta.gouv.fr/personal-information',
                '_blank'
              )
            }
            confirmLabel="Compléter sur Mon Compte Pro"
            cancelLabel="Fermer"
            title="Nous avons besoin d’information"
          >
            <p>
              Afin de compléter votre demande d’habilitation, nous avons besoin
              que vous nous indiquiez votre <b>numéro de téléphone</b>.
            </p>
            <p>
              Vous pouvez le compléter dès à présent sur votre profil Mon Compte
              Pro.
            </p>
          </ConfirmationModal>
        )}

        {(!isEmpty(errorMessages) || !isEmpty(successMessages)) && (
          <div ref={alertRef}>
            {successMessages.map((successMessage) => (
              <Alert type={AlertType.success} key={successMessage}>
                <Linkify message={successMessage} />
              </Alert>
            ))}
            {!isEmpty(errorMessages) && (
              <Alert title="Erreur" type={AlertType.error}>
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
