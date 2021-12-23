import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { groupBy } from 'lodash';
import './index.css';
import { openLink } from '../../../lib';
import { getUserEnrollments } from '../../../services/enrollments';
import Loader from '../../atoms/Loader';
import Enrollment from './Enrollment';
import Button from '../../atoms/Button';
import ButtonGroup from '../../molecules/ButtonGroup';
import Alert from '../../atoms/Alert';

const { REACT_APP_API_GOUV_HOST: API_GOUV_HOST } = process.env;

const UserEnrollmentList = ({ history }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentsByOrganization, setEnrollmentsByOrganization] = useState();

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
      <div className="user-enrollments-header-container">
        <div className="user-enrollments-header">
          <span className="fr-text--lead">Toutes mes demandes</span>
          <div>
            <p style={{ marginBottom: '0.5rem' }} className="rf-text--sm">
              Faire une nouvelle demande pour :
            </p>
            <ButtonGroup>
              <Button large href={`${API_GOUV_HOST}/datapass/api`}>
                une API
              </Button>
              <Button large href="/aidants-connect">
                Aidants Connect
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="full-page">
          <Loader />
        </div>
      )}

      {!isLoading && Object.keys(enrollmentsByOrganization).length <= 0 && (
        <div className="full-page">
          <Alert title="Vous n’avez aucune demande en cours">
            <p>
              👉{' '}
              <a href={`${API_GOUV_HOST}/datapass/api`}>
                Soumettre une demande API
              </a>
            </p>
            <p>
              👉{' '}
              <a href="/aidants-connect">
                Soumettre une demande AidantsConnect
              </a>
            </p>
          </Alert>
        </div>
      )}

      {!isLoading && Object.keys(enrollmentsByOrganization).length > 0 && (
        <div className="user-enrollments-list-container">
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

UserEnrollmentList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default UserEnrollmentList;
