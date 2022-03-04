import React, { useEffect, useState } from 'react';
import { groupBy, isEmpty } from 'lodash';
import './style.css';
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

  return (
    <main className="user-enrollments-page">
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
        <div
          className="page-container user-enrollments-list-container"
          style={{ marginTop: 0 }}
        >
          {Object.keys(enrollmentsByOrganization).map((group) => (
            <React.Fragment key={group}>
              <div className="user-enrollments-organisation-label fr-text--lead">
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
