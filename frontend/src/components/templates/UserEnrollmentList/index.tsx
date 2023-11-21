import React, { useEffect, useState } from 'react';
import { groupBy, isEmpty } from 'lodash';
import { getUserEnrollments } from '../../../services/enrollments';
import Loader from '../../atoms/Loader';
import Alert, { AlertType } from '../../atoms/Alert';
import ListHeader from '../../molecules/ListHeader';
import useListItemNavigation from '../hooks/use-list-item-navigation';
import { NewEnrollmentButton } from '../../molecules/NewEnrollmentButton';
import { useLocation } from 'react-router-dom';
import NoEnrollments from './NoEnrollments';
import { Enrollment as EnrollmentType } from '../../../config';
import IconTitle from '../../molecules/IconTitle';
import { CardContainer } from '../../molecules/Card';
import EnrollmentCard from '../../molecules/EnrollmentCard';
import { EnrollmentStatus } from '../../../config/status-parameters';

const UserEnrollmentList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentsByOrganization, setEnrollmentsByOrganization] =
    useState<Record<string, EnrollmentType[]>>();
  const [showAlert, setShowAlert] = useState(false);

  const { state } = useLocation();
  const { goToItem } = useListItemNavigation();

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
                  <div className="list-group-container">
                    <IconTitle
                      title="Mes habilitations"
                      icon="target"
                      noBorder
                      small
                    />
                    <CardContainer>
                      {validatedEnrollments.map((enrollment) => {
                        return (
                          <EnrollmentCard
                            onSelect={goToItem}
                            enrollment={enrollment}
                          />
                        );
                      })}
                    </CardContainer>
                  </div>
                )}
                {draftEnrollments.length > 0 && (
                  <div className="list-group-container">
                    <IconTitle
                      title="Demandes en brouillon"
                      icon="target"
                      noBorder
                      small
                    />
                    <CardContainer>
                      {draftEnrollments.map((enrollment) => {
                        return (
                          <EnrollmentCard
                            onSelect={goToItem}
                            enrollment={enrollment}
                          />
                        );
                      })}
                    </CardContainer>
                  </div>
                )}
                {otherEnrollments.length > 0 && (
                  <div className="list-group-container">
                    <IconTitle
                      title="En cours d’instruction"
                      icon="target"
                      noBorder
                      small
                    />
                    <CardContainer>
                      {otherEnrollments.map((enrollment) => {
                        return (
                          <EnrollmentCard
                            onSelect={goToItem}
                            enrollment={enrollment}
                          />
                        );
                      })}
                    </CardContainer>
                  </div>
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
