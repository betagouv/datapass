import React, { useEffect, useState } from 'react';
import { groupBy, isEmpty } from 'lodash';
import { getUserEnrollments } from '../../../services/enrollments';
import Loader from '../../atoms/Loader';
import Enrollment from './Enrollment';
import Alert from '../../atoms/Alert';
import ListHeader from '../../molecules/ListHeader';
import useListItemNavigation from '../hooks/use-list-item-navigation';
import { NewEnrollmentButton } from '../../molecules/NewEnrollmentButton';

const UserEnrollmentList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentsByOrganization, setEnrollmentsByOrganization] = useState();
  const [showAlert, setShowAlert] = useState(false);

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
    setShowAlert(!showAlert);
  };

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

      {!isLoading && isEmpty(enrollmentsByOrganization) && (
        <div className="full-page">
          <Alert title="Vous n’avez aucune habilitation" />
        </div>
      )}

      {!isLoading && !isEmpty(enrollmentsByOrganization) && (
        <div className="page-container list-container">
          {!showAlert && (
            <Alert
              type="success"
              title="Votre message a bien été envoyé"
              onAlertClose={handleClose}
            >
              Vous allez recevoir une notification dans votre boite mail au
              moment ou il sera traité.
            </Alert>
          )}
          {Object.keys(enrollmentsByOrganization).map((group) => (
            <React.Fragment key={group}>
              <div className="list-title fr-text--lead">
                {enrollmentsByOrganization[group][0].nom_raison_sociale}
              </div>
              {enrollmentsByOrganization[group].map((enrollment) => (
                <Enrollment
                  key={enrollment.id}
                  {...enrollment}
                  onSelect={goToItem}
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
