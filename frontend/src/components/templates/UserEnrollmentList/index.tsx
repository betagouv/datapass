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
import { isReopenned } from '../../../lib';

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
          default:
            acc.other.push(enrollment);
        }
        return acc;
      },
      { draft: [], validated: [], other: [] }
    );

  const groupEnrollmentsByReopen = (enrollments: Enrollment[]) =>
    enrollments.reduce(
      (
        acc: {
          reopenned: Enrollment[];
          notReopenned: Enrollment[];
        },
        enrollment
      ) => {
        if (isReopenned(enrollment)) {
          acc.reopenned.push(enrollment);
        } else {
          acc.notReopenned.push(enrollment);
        }
        return acc;
      },
      { reopenned: [], notReopenned: [] }
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
        <div className="page-container list-container">
          {showAlert && (
            <Alert type={AlertType.success} onAlertClose={handleClose}>
              {state?.message}
            </Alert>
          )}
          {Object.keys(enrollmentsByOrganization).map((group) => {
            const { reopenned, notReopenned } = groupEnrollmentsByReopen(
              enrollmentsByOrganization[group]
            );
            const { draft, validated, other } =
              groupEnrollmentsByStatus(notReopenned);

            return (
              <React.Fragment key={group}>
                <div className="list-title fr-text--lead">
                  {enrollmentsByOrganization[group][0].nom_raison_sociale}
                </div>
                {[...reopenned, ...validated].length > 0 && (
                  <EnrollmentSection
                    title="Mes habilitations"
                    icon="validated"
                    enrollments={[...reopenned, ...validated]}
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
