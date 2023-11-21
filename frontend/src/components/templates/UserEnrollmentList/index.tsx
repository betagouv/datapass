import React, { useEffect, useState } from 'react';
import { groupBy, isEmpty } from 'lodash';
import { getUserEnrollments } from '../../../services/enrollments';
import Loader from '../../atoms/Loader';
import Alert, { AlertType } from '../../atoms/Alert';
import ListHeader from '../../molecules/ListHeader';
import { NewEnrollmentButton } from '../../molecules/NewEnrollmentButton';
import { useLocation } from 'react-router-dom';
import NoEnrollments from './NoEnrollments';
import { Enrollment as EnrollmentType } from '../../../config';
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
            const draftEnrollments = enrollmentsByOrganization[group].filter(
              ({ status }) => status === EnrollmentStatus.draft
            );

            const validatedEnrollments = enrollmentsByOrganization[
              group
            ].filter(({ status }) => status === EnrollmentStatus.validated);

            const otherEnrollments = enrollmentsByOrganization[group].filter(
              ({ status }) =>
                ![EnrollmentStatus.draft, EnrollmentStatus.validated].includes(
                  status
                )
            );

            return (
              <React.Fragment key={group}>
                <div className="list-title fr-text--lead">
                  {enrollmentsByOrganization[group][0].nom_raison_sociale}
                </div>
                {validatedEnrollments.length > 0 && (
                  <EnrollmentSection
                    title="Mes habilitations"
                    icon="target"
                    enrollments={validatedEnrollments}
                    cardSize="large"
                  />
                )}
                {draftEnrollments.length > 0 && (
                  <EnrollmentSection
                    title="Demandes en brouillon"
                    icon="target"
                    enrollments={draftEnrollments}
                  />
                )}
                {otherEnrollments.length > 0 && (
                  <EnrollmentSection
                    title="En cours d’instruction"
                    icon="target"
                    enrollments={otherEnrollments}
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
