import React, { useState, useEffect } from 'react';
import { groupBy, isEmpty } from 'lodash';
import './style.css';
import { openLink } from '../../../lib';
import { getUserEnrollments } from '../../../services/enrollments';
import Loader from '../../atoms/Loader';
import Enrollment from './Enrollment';
import Button from '../../atoms/Button';
import ButtonGroup from '../../molecules/ButtonGroup';
import Alert from '../../atoms/Alert';
import IndexPointingRightEmoji from '../../atoms/icons/IndexPointingRightEmoji';
import ListHeader from '../../molecules/ListHeader';
import { useHistory } from 'react-router-dom';

const { REACT_APP_API_GOUV_HOST: API_GOUV_HOST } = process.env;

const UserEnrollmentList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentsByOrganization, setEnrollmentsByOrganization] = useState();

  const history = useHistory();

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

  const handleSelectEnrollment = (e, id, target_api) => {
    const targetUrl = `/${target_api.replace(/_/g, '-')}/${id}`;
    openLink(e, history, targetUrl);
  };

  return (
    <main className="user-enrollments-page">
      <ListHeader title="Toutes mes habilitations">
        <div>
          <p style={{ marginBottom: '0.5rem' }} className="rf-text--sm">
            Faire une nouvelle demande pour :
          </p>
          <ButtonGroup>
            <Button
              large
              href={`${API_GOUV_HOST}/datapass/api`}
              className="call-to-action-button"
            >
              une API
            </Button>
            <Button
              large
              href="/aidants-connect"
              className="call-to-action-button"
            >
              Aidants Connect
            </Button>
          </ButtonGroup>
        </div>
      </ListHeader>

      {isLoading && (
        <div className="full-page">
          <Loader />
        </div>
      )}

      {!isLoading && isEmpty(enrollmentsByOrganization) && (
        <div className="full-page">
          <Alert title="Vous n’avez aucune habilitation en cours">
            <p>
              <IndexPointingRightEmoji />
              {' '}
              <a href={`${API_GOUV_HOST}/datapass/api`}>
                Soumettre une demande API
              </a>
            </p>
            <p>
              <IndexPointingRightEmoji />
              {' '}
              <a href="/aidants-connect">
                Soumettre une demande AidantsConnect
              </a>
            </p>
          </Alert>
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
                  onSelect={handleSelectEnrollment}
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
