import React, { useState, useEffect } from 'react';
import { getUserEnrollment } from '../../services/enrollments';
import { Navigate, useParams } from 'react-router-dom';
import Loader from '../atoms/Loader';
import Alert from '../atoms/Alert';
import NotFound from '../organisms/NotFound';

const Enrollment = () => {
  const { enrollmentId } = useParams();
  const [fetchEnrollmentError, setFetchEnrollmentError] = useState(false);
  const [fetchEnrollmentNotFound, setFetchEnrollmentNotFound] = useState(false);
  const [targetApi, setTargetApi] = useState(null);

  const fetchEnrollment = async ({ enrollmentId }) => {
    try {
      setFetchEnrollmentError(false);
      setFetchEnrollmentNotFound(false);
      const { target_api } = await getUserEnrollment(enrollmentId);

      setTargetApi(target_api);
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
      <Navigate
        to={{
          pathname: `/${targetApi.replace(/_/g, '-')}/${enrollmentId}`,
        }}
        replace
      />
    );
  }

  if (fetchEnrollmentNotFound) {
    return <NotFound />;
  }

  if (fetchEnrollmentError) {
    return (
      <div className="full-page">
        <Alert title="Erreur" type="error">
          Erreur inconnue lors de la récupération de l’habilitation.
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

export default Enrollment;
