import React, { useEffect, useState } from 'react';
import { groupBy, isEmpty } from 'lodash';
import { getUserEnrollments } from '../../../services/enrollments';
import Loader from '../../atoms/Loader';
import Alert, { AlertType } from '../../atoms/Alert';
import ListHeader from '../../molecules/ListHeader';
import { NewEnrollmentButton } from '../../molecules/NewEnrollmentButton';
import { useLocation } from 'react-router-dom';
import NoEnrollments from './NoEnrollments';
import { Enrollment, Enrollment as EnrollmentType } from '../../../config';
import { EnrollmentStatus } from '../../../config/status-parameters';
import EnrollmentSection from '../../organisms/EnrollmentSection';

const UserEnrollmentList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentsByOrganization, setEnrollmentsByOrganization] =
    useState<Record<string, EnrollmentType[]>>();
  const [showAlert, setShowAlert] = useState(false);

  const { state } = useLocation();

  useEffect(() => {
    const onFetchData = async () => {
      setIsLoading(true);
      const enrollments = await getUserEnrollments();

      const enrollmentsByOrganization = groupBy(enrollments, (e) => e.siret);

      setEnrollmentsByOrganization(enrollmentsByOrganization);
      setIsLoading(false);
    };

    onFetchData();
  }, []);

  const handleClose = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (state?.message) {
      setShowAlert(true);
    }
  }, [state?.message]);

  const groupEnrollmentsByStatus = (enrollments: Enrollment[]) =>
    enrollments.reduce(
      (
        acc: {
          draft: Enrollment[];
          validated: Enrollment[];
          other: Enrollment[];
          changes_requested: Enrollment[];
        },
        enrollment
      ) => {
        switch (enrollment.status) {
          case EnrollmentStatus.draft:
            acc.draft.push(enrollment);
            break;
          case EnrollmentStatus.validated:
            acc.validated.push(enrollment);
            break;
          case EnrollmentStatus.changes_requested:
            acc.changes_requested.push(enrollment);
            break;
          default:
            acc.other.push(enrollment);
        }
        return acc;
      },
      { draft: [], validated: [], changes_requested: [], other: [] }
    );

  return (
    <main className="list-page list-page-white">
      <ListHeader title="Accueil">
        <NewEnrollmentButton />
      </ListHeader>

      {isLoading && (
        <div className="full-page">
          <Loader />
        </div>
      )}

      {!isLoading && isEmpty(enrollmentsByOrganization) && <NoEnrollments />}

      {!isLoading && !isEmpty(enrollmentsByOrganization) && (
        <div className="list-container">
          {showAlert && (
            <Alert type={AlertType.success} onAlertClose={handleClose}>
              {state?.message}
            </Alert>
          )}
          {Object.keys(enrollmentsByOrganization).map((group) => {
            const { draft, validated, changes_requested, other } =
              groupEnrollmentsByStatus(enrollmentsByOrganization[group]);

            return (
              <React.Fragment key={group}>
                {changes_requested.length > 0 && (
                  <EnrollmentSection
                    highlighted
                    title="Demandes à modifier"
                    icon="changes_requested"
                    enrollments={changes_requested}
                  />
                )}
                {validated.length > 0 && (
                  <EnrollmentSection
                    title="Mes habilitations"
                    icon="validated"
                    enrollments={validated}
                    cardSize="large"
                  />
                )}
                {draft.length > 0 && (
                  <EnrollmentSection
                    title="Demandes en brouillon"
                    icon="draft"
                    enrollments={draft}
                  />
                )}
                {other.length > 0 && (
                  <EnrollmentSection
                    title="En cours d’instruction"
                    icon="pending"
                    enrollments={other}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default UserEnrollmentList;
