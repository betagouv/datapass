import React, { useEffect, useState } from 'react';
import { groupBy, isEmpty } from 'lodash';
import { getUserEnrollments } from '../../../services/enrollments';
import Loader from '../../atoms/Loader';
import EnrollmentComponent from './Enrollment';
import Alert, { AlertType } from '../../atoms/Alert';
import ListHeader from '../../molecules/ListHeader';
import useListItemNavigation from '../hooks/use-list-item-navigation';
import { NewEnrollmentButton } from '../../molecules/NewEnrollmentButton';
import { useLocation } from 'react-router-dom';
import NoEnrollments from './NoEnrollments';

const UserEnrollmentList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentsByOrganization, setEnrollmentsByOrganization] =
    useState<Record<string, Enrollment[]>>();
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
    <main className="list-page">
      <ListHeader title="Toutes mes habilitations">
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
          {Object.keys(enrollmentsByOrganization).map((group) => (
            <React.Fragment key={group}>
              <div className="list-title fr-text--lead">
                {enrollmentsByOrganization[group][0].nom_raison_sociale}
              </div>
              {enrollmentsByOrganization[group].map((enrollment) => (
                <EnrollmentComponent
                  key={enrollment.id}
                  onSelect={goToItem}
                  id={enrollment.id}
                  events={enrollment.events}
                  target_api={enrollment.target_api}
                  intitule={enrollment.intitule}
                  description={enrollment.description}
                  status={enrollment.status}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </main>
  );
};

export default UserEnrollmentList;
