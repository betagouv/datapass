import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getUserEnrollment } from '../../services/enrollments';
import { Redirect } from 'react-router-dom';
import Loader from '../atoms/Loader';
import Alert from '../atoms/Alert';

const Enrollment = ({
  match: {
    params: { enrollmentId },
  },
}) => {
  const [fetchEnrollmentError, setFetchEnrollmentError] = useState(false);
  const [fetchEnrollmentNotFound, setFetchEnrollmentNotFound] = useState(false);
  const [targetApi, settargetApi] = useState(null);

  const fetchEnrollment = async ({ enrollmentId }) => {
    try {
      setFetchEnrollmentError(false);
      setFetchEnrollmentNotFound(false);
      const { target_api } = await getUserEnrollment(enrollmentId);

      settargetApi(target_api);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setFetchEnrollmentNotFound(true);
      } else {
        setFetchEnrollmentError(true);
      }
    }
  };

  useEffect(() => {
    if (enrollmentId) {
      fetchEnrollment({ enrollmentId });
    }
  }, [enrollmentId]);

  if (enrollmentId && targetApi) {
    return (
      <Redirect
        to={{
          pathname: `/${targetApi.replace(/_/g, '-')}/${enrollmentId}`,
        }}
      />
    );
  }

  if (fetchEnrollmentNotFound) {
    return (
      <div className="full-page">
        <Alert title="Erreur" type="error">
          Nous n’avons pas trouvé votre demande d’habilitation.
        </Alert>
      </div>
    );
  }

  if (fetchEnrollmentError) {
    return (
      <div className="full-page">
        <Alert title="Erreur" type="error">
          Erreur inconnue lors de la récupération de la demande d’habilitation.
        </Alert>
      </div>
    );
  }

  return (
    <div className="full-page">
      <Loader />
    </div>
  );
};

Enrollment.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

Enrollment.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default Enrollment;
