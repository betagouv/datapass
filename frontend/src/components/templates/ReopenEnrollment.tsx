import React, { useState, useEffect } from 'react';

import { reopenEnrollment } from '../../services/enrollments';
import { Navigate, useParams } from 'react-router-dom';
import { getErrorMessages } from '../../lib';
import Loader from '../atoms/Loader';
import { Linkify } from '../molecules/Linkify';
import Alert, { AlertType } from '../atoms/Alert';

const ReopenEnrollment = () => {
  const { enrollmentId }: { enrollmentId?: string } = useParams();

  const [errorMessage, setErrorMessage] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [reopennedEnrollmentId, setReopennedEnrollmentId] = useState(null);
  const [reopennedTargetApi, setReopennedTargetApi] = useState<string | null>(
    null
  );

  const triggerReopenEnrollment = async ({
    enrollmentId,
  }: {
    enrollmentId: string;
  }) => {
    try {
      setErrorMessage(null);

      const { id, target_api } = await reopenEnrollment({
        id: Number(enrollmentId),
      });

      setReopennedEnrollmentId(id);
      setReopennedTargetApi(target_api);
    } catch (e: any) {
      if (e.response?.data?.title && e.response?.data?.message) {
        setErrorMessage(e.response.data);
      } else if (getErrorMessages(e)[0]) {
        setErrorMessage({
          title: 'Erreur',
          message: getErrorMessages(e)[0],
        });
      } else {
        setErrorMessage({
          title: 'Erreur',
          message: 'Erreur inconnue lors de la copie de l’habilitation.',
        });
      }
    }
  };

  useEffect(() => {
    if (enrollmentId) {
      triggerReopenEnrollment({ enrollmentId });
    }
  }, [enrollmentId]);

  if (reopennedEnrollmentId && reopennedTargetApi) {
    return (
      <Navigate
        to={`/${reopennedTargetApi.replace(
          /_/g,
          '-'
        )}/${reopennedEnrollmentId}`}
        state={{ source: 'reopen-enrollment-request' }}
        replace
      />
    );
  }

  if (errorMessage) {
    return (
      <div className="full-page">
        <Alert title={errorMessage.title} type={AlertType.warning}>
          <Linkify
            message={`${errorMessage.message} L’habilitation #${enrollmentId} n’a pas été réouverte.`}
          />
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

export default ReopenEnrollment;
